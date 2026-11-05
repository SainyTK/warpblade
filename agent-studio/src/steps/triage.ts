import { promptFor } from "../prompts.ts";
import { readJson, readText, writeJson } from "../services/files.ts";
import { openFeedback } from "../services/githubIssues.ts";
import type { FeedbackIssue, Night, TriageItem } from "../types.ts";
import { callRole } from "./agent.ts";

/** read open feedback issues from GitHub, or from a file on a dry run */
export async function loadFeedback(night: Night, source: string): Promise<FeedbackIssue[]> {
  const items = source === "github" ? await openFeedback(night.ctx.workdir) : await readJson<FeedbackIssue[]>(source);
  await writeJson(night.files.feedback, items);
  return items;
}

/** classify every open item; the agent has no tools and sees the feedback only as data */
export async function triage(night: Night, items: FeedbackIssue[]): Promise<TriageItem[]> {
  if (!items.length) {
    await writeJson(night.files.triage, []);
    return [];
  }
  const data = JSON.stringify(items, null, 2);
  const charter = await readText(`${night.ctx.workdir}/agent-studio/charter.md`);
  const extra = [
    "The charter is reproduced here because you have no tools.",
    "",
    "<charter>",
    charter,
    "</charter>",
    "",
    "<feedback>",
    data,
    "</feedback>",
  ].join("\n");
  const prompt = await promptFor("triage", night.ctx, {}, extra);
  const { output } = await callRole<{ items: TriageItem[] }>(night, { role: "triage", prompt });
  const known = new Set(items.map((f) => f.id));
  const decided = output.items.filter((t) => known.has(t.id));
  await writeJson(night.files.triage, decided);
  return decided;
}
