import { loadIdList, saveIdList } from "./idListStorage";

/** The IDs of the feedback this browser sent, newest first, so the page can show their status later. */
const KEY = "warpblade-own-feedback-v1";

export function loadOwnFeedbackIds(): number[] {
  return loadIdList(KEY);
}

export function addOwnFeedbackId(id: number): void {
  saveIdList(KEY, [id, ...loadOwnFeedbackIds().filter((own) => own !== id)]);
}

/** forget an item the API no longer shows */
export function removeOwnFeedbackId(id: number): void {
  saveIdList(
    KEY,
    loadOwnFeedbackIds().filter((own) => own !== id),
  );
}
