import { FEEDBACK_CATEGORIES } from "../../constants/feedback";
import {
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_STATUS_FILTERS,
  FEEDBACK_STATUS_LABELS,
} from "../../constants/feedbackLabels";
import { listFeedback } from "../../services/feedbackApi";
import type { Feedback, FeedbackCategory, FeedbackStatus } from "../../types/feedback";
import { el } from "../dom";
import { showSkeletonAfterDelay } from "../shell/delayedSkeleton";
import { emptyState } from "../shell/emptyState";
import { errorState } from "../shell/errorState";
import { feedbackCard } from "./feedbackCard";
import { filterChips } from "./filterChips";
import { skeletonCards } from "./skeletonCards";

const ALL = "All";

export interface FeedbackBoard {
  element: HTMLElement;
  load(): Promise<void>;
  /** the card of this item, after clearing filters that hide it; null when the board does not have it */
  reveal(id: number): HTMLElement | null;
}

/** the public feedback, newest first, filtered by status and category; onLoaded runs after each load, retries too */
export function feedbackBoard(onLoaded: () => void): FeedbackBoard {
  const element = el("section", "feedback-board");
  element.setAttribute("aria-labelledby", "board-title");
  const title = el("h2", "section-title", "Player feedback");
  title.id = "board-title";
  const list = el("div", "card-list");
  list.setAttribute("aria-live", "polite");
  list.setAttribute("aria-busy", "false");
  let items: Feedback[] | null = null;

  const render = (): void => {
    if (!items) return;
    const status = statusFilter.value();
    const category = categoryFilter.value();
    const shown = items.filter(
      (item) => (status === null || item.status === status) && (category === null || item.category === category),
    );
    const now = Date.now();
    if (shown.length) list.replaceChildren(...shown.map((item) => feedbackCard(item, now)));
    else list.replaceChildren(emptyState("No feedback to show."));
  };

  const statusFilter = filterChips<FeedbackStatus | null>(
    "Status",
    FEEDBACK_STATUS_FILTERS.map((value) => ({ value, label: value ? FEEDBACK_STATUS_LABELS[value] : ALL })),
    render,
  );
  const categoryFilter = filterChips<FeedbackCategory | null>(
    "Category",
    [null, ...FEEDBACK_CATEGORIES].map((value) => ({ value, label: value ? FEEDBACK_CATEGORY_LABELS[value] : ALL })),
    render,
  );
  const filters = el("div", "filters");
  filters.append(statusFilter.element, categoryFilter.element);
  element.append(title, filters, list);

  async function load(): Promise<void> {
    list.setAttribute("aria-busy", "true");
    const cancelSkeleton = showSkeletonAfterDelay(list, () => skeletonCards(3));
    try {
      items = await listFeedback();
      cancelSkeleton();
      render();
      onLoaded();
    } catch {
      cancelSkeleton();
      list.replaceChildren(errorState("Feedback could not load.", () => void load()));
    } finally {
      list.setAttribute("aria-busy", "false");
    }
  }

  return {
    element,
    load,
    reveal(id) {
      if (!items?.some((item) => item.id === id)) return null;
      statusFilter.set(null);
      categoryFilter.set(null);
      render();
      return list.querySelector<HTMLElement>(`[data-feedback-id="${id}"]`);
    },
  };
}
