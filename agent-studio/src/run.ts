import type { MeasurePick } from "../playtest/fun/index.ts";
import { writeJson } from "./services/files.ts";
import { buildAndVerify, reworkForFun } from "./steps/build.ts";
import { baseline, failed, install, runChecks } from "./steps/checks.ts";
import { direct } from "./steps/direct.ts";
import { finalize } from "./steps/finalize.ts";
import { type BuildScore, funRegression, ledgerScore, pickMeasures, recordFun, scoreBuild } from "./steps/fun.ts";
import { captureMedia } from "./steps/media.ts";
import { prepare } from "./steps/prepare.ts";
import { publish } from "./steps/publish.ts";
import { finished, passedQa, reopen } from "./steps/resume.ts";
import { writeReview } from "./steps/review.ts";
import { loadFeedback, triage } from "./steps/triage.ts";
import { writeNotes } from "./steps/write.ts";
import type { DevReport, FeedbackIssue, MediaItem, Night, Plan, RunOptions, TriageItem } from "./types.ts";

async function orNull<T>(step: string, work: () => Promise<T>): Promise<T | null> {
  try {
    return await work();
  } catch (error) {
    console.error(
      `[studio] ${step} failed; the night goes on without it: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function scorePatch(n: Night, base: BuildScore | null): Promise<BuildScore | null> {
  const { files } = n;
  if (!base) return null;
  const patch = await orNull("Fun scoring of the patch build", () => scoreBuild(n, "patch", "base"));
  const regression = patch && funRegression(base, patch, files.funScore("base"), files.funScore("patch"));
  if (!regression) return patch;
  console.log(`[studio] the patch lowers Fun from ${base.fun} to ${patch.fun}; the developer gets one Fun round`);
  await reworkForFun(n, regression);
  return orNull("Fun scoring of the reworked patch", () => scoreBuild(n, "patch-rework", "base"));
}

/** steps whose output is already saved in the run folder are skipped, so a resumed night continues where it stopped */
async function night(n: Night, options: RunOptions): Promise<string> {
  const { files } = n;
  const saved = <T>(path: string) => (options.resume ? finished<T>(path) : Promise.resolve(null));
  await install(n);
  if (!options.resume) {
    const base = failed(await runChecks(n));
    if (base.length) console.log(`[studio] the base version fails ${base.join(", ")}; the director will see it`);
    await baseline(n);
  }
  const feedback = (await saved<FeedbackIssue[]>(files.feedback)) ?? (await loadFeedback(n, options.feedback));
  const decisions = (await saved<TriageItem[]>(files.triage)) ?? (await triage(n, feedback));
  await orNull("Fun score from the ledger", () => ledgerScore(n));
  const plan = (await saved<Plan>(files.plan)) ?? (await direct(n));
  const picks =
    (await saved<MeasurePick[]>(files.funPicks)) ?? (await orNull("Fun measure picks", () => pickMeasures(n)));
  const base =
    (await saved<BuildScore>(files.funScore("base"))) ??
    (picks && !options.resume
      ? await orNull("Fun scoring of the base build", () => scoreBuild(n, "base", null))
      : null);
  const built = await saved<DevReport>(files.develop);
  if (!(built && (await passedQa(n)))) await buildAndVerify(n, built);
  const fun = (await saved<BuildScore>(files.funScore("final"))) ?? (await scorePatch(n, base));
  if (fun) await writeJson(files.funScore("final"), fun);
  if (!(await saved<MediaItem[]>(files.media))) await captureMedia(n, plan);
  const { patch, replies } = await writeNotes(n, decisions);
  if (base && fun) await recordFun(n, base, fun);
  await finalize(n, patch, decisions, feedback, replies);
  if (n.ctx.mode === "dry") return "dry run finished; nothing was pushed, released or sent";
  await publish(n, patch);
  return `released Patch ${patch.version}`;
}

/** one night of the studio: plan, build, verify, capture, write and, on a live run, ship */
export async function runNight(options: RunOptions): Promise<number> {
  const n = options.resume ? await reopen(options) : await prepare(options);
  if (!n) return 0;
  await writeJson(n.files.context, n.ctx);
  const started = new Date().toISOString();
  try {
    const outcome = await night(n, options);
    await writeReview(n, outcome);
    await writeJson(n.files.summary, {
      status: "ok",
      outcome,
      version: n.ctx.version,
      started,
      finished: new Date().toISOString(),
      costs: n.costs,
    });
    console.log(`[studio] ${outcome}. Review: ${n.files.review}`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeReview(n, `failed: ${message}`).catch(() => undefined);
    await writeJson(n.files.summary, {
      status: "failed",
      error: message,
      version: n.ctx.version,
      started,
      finished: new Date().toISOString(),
      costs: n.costs,
    });
    console.error(`[studio] failed: ${message}`);
    return 1;
  }
}
