import { FeedbackApiError, getFeedback } from "../../services/feedbackApi";
import { loadOwnFeedbackIds, removeOwnFeedbackId } from "../../services/ownFeedback";
import type { Feedback } from "../../types/feedback";
import { el } from "../dom";
import { showSkeletonAfterDelay } from "../shell/delayedSkeleton";
import { errorState } from "../shell/errorState";
import { feedbackCard } from "./feedbackCard";
import { skeletonCards } from "./skeletonCards";

export interface OwnFeedbackList {
  element: HTMLElement;
  load(): Promise<void>;
  /** put a just-sent item at the top */
  add(item: Feedback): void;
  find(id: number): HTMLElement | null;
}

/** "Your feedback": what this browser sent, with its current status and the studio's reply */
export function ownFeedbackList(): OwnFeedbackList {
  const element = el("section", "own-feedback");
  element.setAttribute("aria-labelledby", "own-title");
  const title = el("h2", "section-title", "Your feedback");
  title.id = "own-title";
  const list = el("div", "card-list");
  element.append(title, list);
  element.hidden = true;

  async function load(): Promise<void> {
    const ids = loadOwnFeedbackIds();
    if (!ids.length) return;
    element.hidden = false;
    const cancelSkeleton = showSkeletonAfterDelay(list, () => skeletonCards(Math.min(ids.length, 3)));
    const results = await Promise.allSettled(ids.map(getFeedback));
    cancelSkeleton();
    const items: Feedback[] = [];
    let unreachable = false;
    results.forEach((result, index) => {
      if (result.status === "fulfilled") items.push(result.value);
      else if (result.reason instanceof FeedbackApiError && result.reason.status === 404)
        removeOwnFeedbackId(ids[index]);
      else unreachable = true;
    });
    const now = Date.now();
    list.replaceChildren(...items.map((item) => feedbackCard(item, now)));
    if (unreachable) list.append(errorState("Your feedback could not load.", () => void load()));
    element.hidden = list.childElementCount === 0;
  }

  return {
    element,
    load,
    add(item) {
      element.hidden = false;
      list.prepend(feedbackCard(item, Date.now()));
    },
    find(id) {
      return list.querySelector<HTMLElement>(`[data-feedback-id="${id}"]`);
    },
  };
}
