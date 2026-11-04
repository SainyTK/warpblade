import { REPO_SLUG } from "../constants.ts";
import { run } from "./shell.ts";

interface Release {
  tag: string;
  title: string;
  notesFile: string;
  assets: string[];
}

export async function createRelease(cwd: string, release: Release): Promise<string> {
  const args = ["release", "create", release.tag, "--repo", REPO_SLUG, "--title", release.title];
  args.push("--notes-file", release.notesFile, "--verify-tag", "--latest", ...release.assets);
  return run("gh", args, { cwd });
}

interface PullRequest {
  branch: string;
  title: string;
  bodyFile: string;
}

/** open a pull request for the pushed patch branch, merge it with a merge commit and delete the remote branch */
export async function mergePatch(cwd: string, pr: PullRequest): Promise<string> {
  const url = await run(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      REPO_SLUG,
      "--base",
      "main",
      "--head",
      pr.branch,
      "--title",
      pr.title,
      "--body-file",
      pr.bodyFile,
    ],
    { cwd },
  );
  // no --delete-branch: it would try to check out main here, and main is checked out in another worktree
  await run("gh", ["pr", "merge", url, "--repo", REPO_SLUG, "--merge"], { cwd });
  await run("git", ["push", "origin", "--delete", pr.branch], { cwd });
  return url;
}
