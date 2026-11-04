import type { FeedbackCategory, FeedbackStatus } from "../types/feedback";

export const FEEDBACK_CATEGORIES: readonly FeedbackCategory[] = ["bug", "balance", "idea", "other"];
export const FEEDBACK_STATUSES: readonly FeedbackStatus[] = [
  "new",
  "planned",
  "addressed",
  "skipped",
  "duplicate",
  "hidden",
];
/** statuses anyone can see in the public list; new items wait for the studio's nightly read */
export const PUBLIC_FEEDBACK_STATUSES: readonly FeedbackStatus[] = ["planned", "addressed", "skipped", "duplicate"];
export const FEEDBACK_LIMITS = { messageMin: 10, messageMax: 1000, nameMax: 40, replyMax: 600 } as const;
