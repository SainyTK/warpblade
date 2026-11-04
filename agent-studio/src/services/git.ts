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
  const out = await git(cwd, "status", "--porcelain", "--untracked-files=all");
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3));
}

export const commitAll = async (cwd: string, message: string) => {
  await git(cwd, "add", "-A");
  await git(cwd, "commit", "-m", message);
};
