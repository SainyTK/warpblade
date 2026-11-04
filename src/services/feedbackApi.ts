import { FEEDBACK_API } from "../constants/feedbackApi";
import type { Feedback, FeedbackList, NewFeedback } from "../types/feedback";

/** Calls to the feedback API Worker. A failed call throws FeedbackApiError: status is null when the API was not
    reached, and message is the API's own error text when it answered with one. */
export class FeedbackApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${FEEDBACK_API}${path}`, init);
  } catch {
    throw new FeedbackApiError("The feedback server could not be reached.", null);
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = (body as { error?: unknown } | null)?.error;
    throw new FeedbackApiError(
      typeof error === "string" ? error : `The feedback server answered ${response.status}.`,
      response.status,
    );
  }
  return body as T;
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

/** public items, newest first */
export async function listFeedback(): Promise<Feedback[]> {
  return (await request<FeedbackList>("/api/feedback")).items;
}

export async function getFeedback(id: number): Promise<Feedback> {
  return (await request<{ item: Feedback }>(`/api/feedback/${id}`)).item;
}

export async function sendFeedback(feedback: NewFeedback): Promise<Feedback> {
  return (await request<{ item: Feedback }>("/api/feedback", json(feedback))).item;
}

/** adds one vote and returns the new total */
export async function voteFeedback(id: number): Promise<number> {
  return (await request<{ votes: number }>(`/api/feedback/${id}/vote`, { method: "POST" })).votes;
}
