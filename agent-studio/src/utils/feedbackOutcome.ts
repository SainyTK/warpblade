import type { FeedbackUpdate } from "../../../src/types/feedback.ts";
import { PLANNED_REPLY } from "../constants.ts";
import type { TriageItem, WriterReply } from "../types.ts";

export interface FeedbackChange {
  id: number;
  update: FeedbackUpdate;
}

/** turn the night's triage and what shipped into one status change per feedback item */
export function feedbackChanges(
  triage: TriageItem[],
  addressed: number[],
  replies: WriterReply[],
  version: string,
): FeedbackChange[] {
  const replyFor = new Map(replies.map((r) => [r.id, r.reply]));
  const shipped = new Set(addressed);
  return triage.map((item): FeedbackChange => {
    if (shipped.has(item.id)) {
      const reply = replyFor.get(item.id) ?? `Addressed in Patch ${version}.`;
      return { id: item.id, update: { status: "addressed", patch: version, reply } };
    }
    if (item.decision === "now") return { id: item.id, update: { status: "planned", reply: PLANNED_REPLY } };
    if (item.decision === "later")
      return { id: item.id, update: { status: "planned", reply: item.reply || PLANNED_REPLY } };
    if (item.decision === "skip") return { id: item.id, update: { status: "skipped", reply: item.reply } };
    if (item.decision === "duplicate") {
      return { id: item.id, update: { status: "duplicate", duplicateOf: item.duplicateOf, reply: item.reply || null } };
    }
    return { id: item.id, update: { status: "hidden", reply: null } };
  });
}
