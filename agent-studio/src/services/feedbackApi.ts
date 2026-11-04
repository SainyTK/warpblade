import { readFile } from "node:fs/promises";
import type { Feedback, FeedbackList, FeedbackUpdate } from "../../../src/types/feedback.ts";
import { FEEDBACK_API_URL, FEEDBACK_OPEN_STATUSES, FEEDBACK_TOKEN_FILE } from "../constants.ts";

async function token(): Promise<string> {
  return (await readFile(FEEDBACK_TOKEN_FILE, "utf8")).trim();
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${FEEDBACK_API_URL}/api/feedback/admin${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
  });
  if (!response.ok) throw new Error(`Feedback API ${path} answered ${response.status}: ${await response.text()}`);
  return (await response.json()) as T;
}

/** feedback the studio has not settled yet: new items and planned ones */
export async function openFeedback(): Promise<Feedback[]> {
  const list = await call<FeedbackList>(`/items?status=${FEEDBACK_OPEN_STATUSES.join(",")}`);
  return list.items;
}

export async function updateFeedback(id: number, update: FeedbackUpdate): Promise<void> {
  await call(`/items/${id}`, { method: "PATCH", body: JSON.stringify(update) });
}
