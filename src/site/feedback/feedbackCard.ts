import { PUBLIC_FEEDBACK_STATUSES } from "../../constants/feedback";
import { FEEDBACK_CATEGORY_LABELS } from "../../constants/feedbackLabels";
import type { Feedback } from "../../types/feedback";
import { formatRelative, formatStamp } from "../../utils/formatDate";
import { el } from "../dom";
import { chip } from "../shell/chip";
import { statusChip } from "./statusChip";
import { studioReply } from "./studioReply";
import { voteButton } from "./voteButton";

/** one piece of feedback: number, category, status, message, who and when, votes and the studio's reply */
export function feedbackCard(item: Feedback, now: number): HTMLElement {
  const card = el("article", "feedback-card panel");
  card.dataset.feedbackId = String(item.id);
  card.tabIndex = -1;

  const head = el("header", "card-head");
  head.append(
    el("span", "card-id", `#${item.id}`),
    chip(FEEDBACK_CATEGORY_LABELS[item.category], "--mist", "chip-plain"),
    statusChip(item),
  );
  card.append(head, el("p", "card-message", item.message));
  if (item.reply) card.append(studioReply(item.reply));

  const foot = el("footer", "card-foot");
  const meta = el("p", "card-meta");
  const when = el("time", undefined, formatRelative(item.createdAt, now));
  when.dateTime = item.createdAt;
  when.title = formatStamp(item.createdAt);
  meta.append(el("span", "card-author", item.name ?? "Anonymous"), when);
  foot.append(meta);
  // only public items take votes; the player's own new item waits for the studio first
  if (PUBLIC_FEEDBACK_STATUSES.includes(item.status)) foot.append(voteButton(item));
  card.append(foot);
  return card;
}
