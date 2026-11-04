import { FEEDBACK_STATUS_LABELS } from "../../constants/feedbackLabels";
import type { Feedback, FeedbackStatus } from "../../types/feedback";
import { link, setAccent } from "../dom";
import { chip } from "../shell/chip";

const STATUS_ACCENT: Record<FeedbackStatus, string> = {
  new: "--crystal",
  planned: "--volt",
  addressed: "--heal",
  skipped: "--mist",
  duplicate: "--mist",
  hidden: "--muted",
};

export const cardHref = (id: number): string => `#${id}`;

function linkChip(href: string, text: string, accent: string): HTMLAnchorElement {
  const node = link(href, text, "chip");
  setAccent(node, accent);
  return node;
}

/** "Planned", "Addressed in 0.2.1" linking to its patch, "Not planned", or "Duplicate of #n" linking to that card */
export function statusChip(item: Feedback): HTMLElement {
  const label = FEEDBACK_STATUS_LABELS[item.status];
  const accent = STATUS_ACCENT[item.status];
  if (item.status === "addressed" && item.patch)
    return linkChip(`/patches/#${item.patch}`, `${label} in ${item.patch}`, accent);
  if (item.status === "duplicate" && item.duplicateOf !== null)
    return linkChip(cardHref(item.duplicateOf), `${label} of #${item.duplicateOf}`, accent);
  return chip(label, accent);
}
