import { PLANNED_REPLY, SITE_URL } from "../constants.ts";
import type { FeedbackIssue, TriageItem, WriterReply } from "../types.ts";

/** what the studio does to one feedback issue after a night */
export interface FeedbackChange {
  id: number;
  action: "addressed" | "planned" | "skipped" | "duplicate" | "hidden";
  /** the comment posted on the issue; empty for hidden */
  reply: string;
  duplicateOf: number | null;
}

/** one change per feedback issue from the night's triage and what shipped; issues already planned stay untouched */
export function feedbackChanges(
  triage: TriageItem[],
  issues: FeedbackIssue[],
  addressed: number[],
  replies: WriterReply[],
  version: string,
): FeedbackChange[] {
  const replyFor = new Map(replies.map((r) => [r.id, r.reply]));
  const planned = new Set(issues.filter((i) => i.planned).map((i) => i.id));
  const shipped = new Set(addressed);
  const changes: FeedbackChange[] = [];
  for (const item of triage) {
    const base = { id: item.id, duplicateOf: null };
    if (shipped.has(item.id)) {
      const reply = replyFor.get(item.id) ?? `Addressed in Patch ${version}.`;
      changes.push({ ...base, action: "addressed", reply: `${reply}\n\nPatch notes: ${SITE_URL}/patches/#${version}` });
    } else if (item.decision === "now" || item.decision === "later") {
      if (!planned.has(item.id)) changes.push({ ...base, action: "planned", reply: item.reply || PLANNED_REPLY });
    } else if (item.decision === "skip") {
      changes.push({ ...base, action: "skipped", reply: item.reply });
    } else if (item.decision === "duplicate" && item.duplicateOf !== null) {
      changes.push({ ...base, action: "duplicate", reply: item.reply, duplicateOf: item.duplicateOf });
    } else if (item.decision === "hide") {
      changes.push({ ...base, action: "hidden", reply: "" });
    }
  }
  return changes;
}
