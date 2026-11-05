import type { Patch } from "../../../src/types/patch.ts";
import { writeJson, writeText } from "../services/files.ts";
import { commitAll, git } from "../services/git.ts";
import { run } from "../services/shell.ts";
import type { FeedbackIssue, Night, TriageItem, WriterReply } from "../types.ts";
import { feedbackChanges } from "../utils/feedbackOutcome.ts";
import { releaseNotes, releaseTitle } from "../utils/releaseNotes.ts";
import { failed, runChecks } from "./checks.ts";
import { guardPatch } from "./guards.ts";

/** set the version, check everything once more, commit the patch, and write the release notes and feedback changes */
export async function finalize(
  night: Night,
  patch: Patch,
  triage: TriageItem[],
  issues: FeedbackIssue[],
  replies: WriterReply[],
): Promise<void> {
  const { ctx, files } = night;
  await run("npm", ["version", ctx.version, "--no-git-tag-version", "--allow-same-version"], { cwd: ctx.workdir });
  const broken = failed(await runChecks(night));
  if (broken.length) throw new Error(`Final checks failed: ${broken.join(", ")}; see ${files.checksLog}`);
  await commitAll(ctx.workdir, `${releaseTitle(patch)}\n\n${patch.tagline}`);
  await guardPatch(night);
  const notes = releaseNotes(patch);
  await writeText(files.releaseNotes, notes);
  const stat = await git(ctx.workdir, "diff", "--shortstat", `${ctx.baseSha}..HEAD`);
  await writeText(files.prBody, `${notes}\n---\n\nBuilt by the agent studio. ${stat}.\n`);
  const addressed = patch.feedback.map((f) => f.id);
  await writeJson(files.feedbackChanges, feedbackChanges(triage, issues, addressed, replies, ctx.version));
}
