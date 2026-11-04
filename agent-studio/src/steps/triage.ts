import type { Feedback } from "../../../src/types/feedback.ts";
import { promptFor } from "../prompts.ts";
import { openFeedback } from "../services/feedbackApi.ts";
import { readJson, readText, writeJson } from "../services/files.ts";
import type { Night, TriageItem } from "../types.ts";
import { callRole } from "./agent.ts";

/** the fields triage reads; names stay out so nothing personal reaches the agents */
function asData(items: Feedback[]) {
  return items.map((f) => ({
    id: f.id,
    category: f.category,
    status: f.status,
    votes: f.votes,
    gameVersion: f.gameVersion,
    createdAt: f.createdAt,
    message: f.message,
    previousReply: f.reply,
  }));
}

/** read open feedback from the API, or from a file on a dry run */
export async function loadFeedback(night: Night, source: string): Promise<Feedback[]> {
  const items = source === "api" ? await openFeedback() : await readJson<Feedback[]>(source);
  await writeJson(night.files.feedback, items);
  return items;
}

/** classify every open item; the agent has no tools and sees the feedback only as data */
export async function triage(night: Night, items: Feedback[]): Promise<TriageItem[]> {
  if (!items.length) {
    await writeJson(night.files.triage, []);
    return [];
  }
  const data = JSON.stringify(asData(items), null, 2);
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
