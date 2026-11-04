import type { FeedbackCategory, FeedbackStatus } from "../types/feedback";

/** what the feedback page calls each category and status */
export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: "Bug",
  balance: "Balance",
  idea: "Idea",
  other: "Other",
};

/** addressed and duplicate chips add the patch or the original item to these */
export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "Received",
  planned: "Planned",
  addressed: "Addressed",
  skipped: "Not planned",
  duplicate: "Duplicate",
  hidden: "Hidden",
};

/** the status filters of the public board; null shows every public item */
export const FEEDBACK_STATUS_FILTERS: readonly (FeedbackStatus | null)[] = [null, "planned", "addressed", "skipped"];
