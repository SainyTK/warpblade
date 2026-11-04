import { writeJson } from "./services/files.ts";
import { buildAndVerify } from "./steps/build.ts";
import { baseline, failed, install, runChecks } from "./steps/checks.ts";
import { direct } from "./steps/direct.ts";
import { finalize } from "./steps/finalize.ts";
import { captureMedia } from "./steps/media.ts";
import { prepare } from "./steps/prepare.ts";
import { publish } from "./steps/publish.ts";
import { writeReview } from "./steps/review.ts";
import { loadFeedback, triage } from "./steps/triage.ts";
import { writeNotes } from "./steps/write.ts";
import type { Night, RunOptions } from "./types.ts";

async function night(n: Night, options: RunOptions): Promise<string> {
  await install(n);
  const base = failed(await runChecks(n));
  if (base.length)
    console.log(`[studio] the base version fails ${base.join(", ")}; the director will see it in the baseline`);
  await baseline(n);
  const feedback = await loadFeedback(n, options.feedback);
  const decisions = await triage(n, feedback);
  const plan = await direct(n);
  await buildAndVerify(n);
  await captureMedia(n, plan);
  const { patch, replies } = await writeNotes(n, decisions);
  await finalize(n, patch, decisions, replies);
  if (n.ctx.mode === "dry") return "dry run finished; nothing was pushed, released or sent";
  await publish(n, patch);
  return `released Patch ${patch.version}`;
}

/** one night of the studio: plan, build, verify, capture, write and, on a live run, ship */
export async function runNight(options: RunOptions): Promise<number> {
  const n = await prepare(options);
  if (!n) return 0;
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
