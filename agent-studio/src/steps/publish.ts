import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Patch } from "../../../src/types/patch.ts";
import { MAIN_BRANCH } from "../constants.ts";
import { updateFeedback } from "../services/feedbackApi.ts";
import { readJson, writeJson } from "../services/files.ts";
import { git } from "../services/git.ts";
import { createRelease, mergePatch } from "../services/github.ts";
import type { Night } from "../types.ts";
import type { FeedbackChange } from "../utils/feedbackOutcome.ts";
import { releaseTitle } from "../utils/releaseNotes.ts";
import { failed, runChecks } from "./checks.ts";

/** bring in anything merged to main since the base, and check the combination before it ships */
async function catchUp(night: Night): Promise<void> {
  const { workdir } = night.ctx;
  await git(workdir, "fetch", "origin", MAIN_BRANCH);
  const behind = await git(workdir, "rev-list", "--count", `HEAD..origin/${MAIN_BRANCH}`);
  if (behind === "0") return;
  try {
    await git(workdir, "merge", "--no-edit", `origin/${MAIN_BRANCH}`);
  } catch (error) {
    await git(workdir, "merge", "--abort");
    throw new Error(`main moved and no longer merges cleanly with the patch: ${String(error)}`);
  }
  const broken = failed(await runChecks(night));
  if (broken.length) throw new Error(`The patch merged with the latest main fails: ${broken.join(", ")}`);
}

/** merge to main (which deploys the site), tag, release on GitHub and answer the feedback */
export async function publish(night: Night, patch: Patch): Promise<void> {
  const { ctx, files } = night;
  await catchUp(night);
  await git(ctx.workdir, "push", "--force-with-lease", "origin", `${ctx.branch}:${ctx.branch}`);
  const pr = await mergePatch(ctx.workdir, { branch: ctx.branch, title: releaseTitle(patch), bodyFile: files.prBody });
  await git(ctx.workdir, "fetch", "origin", MAIN_BRANCH);
  const tag = `v${ctx.version}`;
  await git(ctx.workdir, "tag", "-a", tag, `origin/${MAIN_BRANCH}`, "-m", releaseTitle(patch));
  await git(ctx.workdir, "push", "origin", tag);
  const gifs = (await readdir(files.releaseAssets))
    .filter((f) => f.endsWith(".gif"))
    .map((f) => join(files.releaseAssets, f));
  const release = await createRelease(ctx.workdir, {
    tag,
    title: releaseTitle(patch),
    notesFile: files.releaseNotes,
    assets: gifs,
  });
  const changes = await readJson<FeedbackChange[]>(files.feedbackChanges);
  const feedbackErrors: string[] = [];
  for (const change of changes) {
    await updateFeedback(change.id, change.update).catch((error: unknown) =>
      feedbackErrors.push(`#${change.id}: ${String(error)}`),
    );
  }
  await writeJson(files.publish, { pr, release, tag, feedbackErrors });
  if (feedbackErrors.length)
    throw new Error(`Released ${tag}, but some feedback updates failed: ${feedbackErrors.join("; ")}`);
}
