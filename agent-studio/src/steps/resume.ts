import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { runFiles } from "../runFiles.ts";
import { readJson } from "../services/files.ts";
import { git } from "../services/git.ts";
import type { Night, QaReport, RunContext, RunOptions } from "../types.ts";
import { NO_DAY_WORK } from "../utils/dayWork.ts";

/** a step's saved output, or null when the step has not finished */
export const finished = <T>(path: string): Promise<T | null> => readJson<T>(path).catch(() => null);

/** the night's run folder, found by its date and mode */
async function runFolder(options: RunOptions): Promise<string> {
  const names = await readdir(options.runsDir);
  const found = names.find((n) => n.startsWith(`${options.date}-`) && n.endsWith(`-${options.mode}`));
  if (!found) throw new Error(`There is no ${options.mode} run for ${options.date} in ${options.runsDir} to resume`);
  return join(options.runsDir, found);
}

/** reopen a night that stopped: its saved context, on the patch branch at the commit checked out now */
export async function reopen(options: RunOptions): Promise<Night> {
  const runDir = await runFolder(options);
  const files = runFiles(runDir);
  const saved = await readJson<RunContext>(files.context);
  const ctx: RunContext = {
    ...saved,
    // runs saved before day work was tracked have no dayWork
    dayWork: saved.dayWork ?? NO_DAY_WORK,
    workdir: options.workdir,
    baseSha: options.baseSha ?? saved.baseSha,
  };
  await git(ctx.workdir, "checkout", "-B", ctx.branch);
  console.log(`[studio] resuming ${ctx.kind} patch ${ctx.version} for ${ctx.date} on ${ctx.branch}`);
  // the earlier attempts' agent costs carry over, so the review shows what the whole night cost
  const earlier = await finished<{ costs: Record<string, number> }>(files.summary);
  return { ctx, files, costs: earlier?.costs ?? {}, sessionTotals: {} };
}

/** the last QA round, when it passed */
export async function passedQa(night: Night): Promise<QaReport | null> {
  const rounds = (await readdir(night.ctx.runDir)).filter((f) => /^qa-\d+\.json$/.test(f)).sort();
  const last = rounds.at(-1);
  if (!last) return null;
  const report = await readJson<QaReport>(join(night.ctx.runDir, last));
  return report.verdict === "pass" && !report.issues.some((i) => i.severity !== "minor") ? report : null;
}
