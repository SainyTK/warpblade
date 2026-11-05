import { access } from "node:fs/promises";
import { join } from "node:path";
import type { Patch, PatchMedia } from "../../../src/types/patch.ts";
import { promptFor } from "../prompts.ts";
import { readJson, writeJson, writeText } from "../services/files.ts";
import { git, headSha } from "../services/git.ts";
import { schemaErrors } from "../services/schemas.ts";
import type { Night, TriageItem, WriterReply } from "../types.ts";
import { callRole } from "./agent.ts";
import { guardStep } from "./guards.ts";

export const patchPath = (night: Night) =>
  join(night.ctx.workdir, "src", "content", "patches", `${night.ctx.version}.json`);

function mediaOf(patch: Patch): PatchMedia[] {
  const entries = patch.sections.flatMap((s) => s.entries);
  return [...patch.highlights.map((h) => h.media), ...entries.flatMap((e) => (e.media ? [e.media] : []))];
}

/** the patch file is valid, matches tonight and points only at real media and real feedback */
async function patchProblems(night: Night, patch: Patch, triage: TriageItem[]): Promise<string[]> {
  const { ctx } = night;
  const problems = await schemaErrors("patch", patch);
  if (patch.version !== ctx.version) problems.push(`version is ${patch.version}, expected ${ctx.version}`);
  if (patch.kind !== ctx.kind) problems.push(`kind is ${patch.kind}, expected ${ctx.kind}`);
  if (patch.date !== ctx.date) problems.push(`date is ${patch.date}, expected ${ctx.date}`);
  if (ctx.kind === "big" && !patch.highlights.length) problems.push("a big patch needs highlights");
  if (ctx.kind === "small" && patch.highlights.length) problems.push("a small patch has no highlights");
  const folder = join(ctx.workdir, "public", "patches", ctx.version);
  for (const media of mediaOf(patch)) {
    for (const file of [media.file, media.poster].filter((f): f is string => Boolean(f))) {
      const found = await access(join(folder, file)).then(
        () => true,
        () => false,
      );
      if (!found) problems.push(`media file ${file} is not in public/patches/${ctx.version}/`);
    }
  }
  const known = new Set(triage.map((t) => t.id));
  for (const item of patch.feedback) {
    if (!known.has(item.id)) problems.push(`feedback #${item.id} was not in tonight's feedback`);
  }
  const listed = new Set(patch.feedback.map((f) => f.id));
  for (const id of ctx.dayWork.feedback) {
    if (known.has(id) && !listed.has(id))
      problems.push(`feedback #${id} was addressed by day work but is not in feedback`);
  }
  return problems;
}

/** the writer turns the night into patch notes, the journal entry and the roadmap update */
export async function writeNotes(
  night: Night,
  triage: TriageItem[],
): Promise<{ patch: Patch; replies: WriterReply[] }> {
  const { files, ctx } = night;
  const since = await headSha(ctx.workdir);
  await writeText(
    files.diff,
    await git(ctx.workdir, "diff", "--stat", "--patch", `${ctx.baseSha}..HEAD`, "--", ".", ":(exclude)public/patches"),
  );
  const owned = [
    `src/content/patches/${ctx.version}.json`,
    `agent-studio/journal/${ctx.version}.md`,
    "agent-studio/roadmap.md",
  ];
  const inputs = {
    "The plan with the director's memo": files.plan,
    "Developer report": files.develop,
    "QA verdicts (qa-N.json, the highest N is the last)": ctx.runDir,
    "Media list": files.media,
    "Triaged feedback": files.triage,
    "Diff from the base commit": files.diff,
    "Commits since the last release": files.commits,
  };
  let feedback = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = await promptFor("writer", ctx, inputs, feedback);
    const { output } = await callRole<{ replies: WriterReply[] }>(night, {
      role: "writer",
      prompt,
      label: attempt ? "writer-fix" : "writer",
    });
    await guardStep(night, since, (p) => owned.includes(p), "writer");
    const patch = await readJson<Patch>(patchPath(night)).catch(() => null);
    const problems = patch ? await patchProblems(night, patch, triage) : [`${owned[0]} was not written`];
    if (!problems.length && patch) {
      await writeJson(files.write, output);
      return { patch, replies: output.replies };
    }
    feedback = `Your last attempt had these problems. Fix them in the files and answer again:\n${problems.map((p) => `- ${p}`).join("\n")}`;
  }
  throw new Error(`The patch notes are still invalid after a second attempt: ${feedback}`);
}
