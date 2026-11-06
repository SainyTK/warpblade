import { PROTECTED_PATHS } from "../constants.ts";
import { changedFiles, commitAll, dirtyFiles, git } from "../services/git.ts";
import type { Night } from "../types.ts";

/** paths from the list that a step was not allowed to change */
export function outside(paths: string[], allowed: (path: string) => boolean): string[] {
  return paths.filter((p) => !allowed(p));
}

export const isProtected = (path: string) => PROTECTED_PATHS.some((p) => path === p || path.startsWith(p));

/** refuse a patch that changes owner-only files */
export async function guardPatch(night: Night): Promise<void> {
  const { workdir, baseSha } = night.ctx;
  const touched = (await changedFiles(workdir, baseSha)).filter(isProtected);
  if (touched.length) throw new Error(`The patch changes owner-only files: ${touched.join(", ")}`);
}

/** commit what an agent left uncommitted, so every step starts from a clean tree */
export async function commitLeftovers(night: Night, message: string): Promise<void> {
  if ((await dirtyFiles(night.ctx.workdir)).length) await commitAll(night.ctx.workdir, message);
}

/** undo uncommitted changes by a step that must not edit the repo, and report them */
export async function discardChanges(night: Night): Promise<string[]> {
  const dirty = await dirtyFiles(night.ctx.workdir);
  if (dirty.length) {
    await git(night.ctx.workdir, "checkout", "--", ".");
    await git(night.ctx.workdir, "clean", "-fd");
  }
  return dirty;
}

/** a step may change only allowed paths, committed or not, since the given commit */
export async function guardStep(
  night: Night,
  since: string,
  allowed: (path: string) => boolean,
  step: string,
): Promise<void> {
  const committed = await changedFiles(night.ctx.workdir, since);
  const dirty = await dirtyFiles(night.ctx.workdir);
  const bad = outside([...committed, ...dirty], allowed);
  if (bad.length) throw new Error(`The ${step} step changed files it does not own: ${bad.join(", ")}`);
}
