/** Player feedback, shared by the feedback page, the feedback API Worker and the agent studio. */

export type FeedbackCategory = "bug" | "balance" | "idea" | "other";

/** new: not read yet. planned: the studio will do it. addressed: done in `patch`. skipped: not planned, with a reply.
    duplicate: same as `duplicateOf`. hidden: spam or abuse, never shown. */
export type FeedbackStatus = "new" | "planned" | "addressed" | "skipped" | "duplicate" | "hidden";

export interface Feedback {
  id: number;
  createdAt: string;
  updatedAt: string;
  category: FeedbackCategory;
  message: string;
  /** the name the player gave, if any */
  name: string | null;
  /** the game version the player was on */
  gameVersion: string | null;
  status: FeedbackStatus;
  /** the studio's reply to the player */
  reply: string | null;
  /** the patch version that addressed it */
  patch: string | null;
  duplicateOf: number | null;
  votes: number;
}

/** what the feedback page sends; `website` is a honeypot field that people never fill */
export interface NewFeedback {
  category: FeedbackCategory;
  message: string;
  name?: string;
  gameVersion?: string;
  website?: string;
}

/** what the agent studio sends to change an item */
export interface FeedbackUpdate {
  status: FeedbackStatus;
  reply?: string | null;
  patch?: string | null;
  duplicateOf?: number | null;
}

export interface FeedbackList {
  items: Feedback[];
}
