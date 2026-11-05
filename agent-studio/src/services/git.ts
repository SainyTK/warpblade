import type { DayWork } from "../types.ts";
import { DAY_WORK_FORMAT, parseDayWork } from "../utils/dayWork.ts";
import { run } from "./shell.ts";

export function git(cwd: string, ...args: string[]): Promise<string> {
  return run("git", args, { cwd });
}

export const headSha = (cwd: string) => git(cwd, "rev-parse", "HEAD");

/** the newest v* tag reachable from HEAD, or null before the first release */
export async function lastTag(cwd: string): Promise<string | null> {
  const tags = await git(cwd, "tag", "--merged", "HEAD", "--list", "v*", "--sort=-v:refname");
  return tags.split("\n").find(Boolean) ?? null;
}

export async function changedFiles(cwd: string, from: string): Promise<string[]> {
  const out = await git(cwd, "diff", "--name-only", `${from}..HEAD`);
  return out.split("\n").filter(Boolean);
}

/** files changed in the working tree but not committed, including untracked ones */
export async function dirtyFiles(cwd: string): Promise<string[]> {
  // plain path lists: `git status --porcelain` lines start with a space that trimming output would eat
  const tracked = await git(cwd, "diff", "--name-only", "HEAD");
  const untracked = await git(cwd, "ls-files", "--others", "--exclude-standard");
  return [...new Set([...tracked.split("\n"), ...untracked.split("\n")].filter(Boolean))];
}

export const commitAll = async (cwd: string, message: string) => {
  await git(cwd, "add", "-A");
  await git(cwd, "commit", "-m", message);
};

/** the day work declared by commit trailers in a range such as `v0.2.0..HEAD` */
export async function dayWorkIn(cwd: string, range: string): Promise<DayWork> {
  return parseDayWork(await git(cwd, "log", "--no-merges", `--format=${DAY_WORK_FORMAT}`, range));
}
