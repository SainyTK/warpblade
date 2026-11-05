import { feedbackIssueUrl } from "../../constants/feedback";
import type { PatchFeedbackItem } from "../../types/patch";
import { el, link, setAccent } from "../dom";

export const YOU_ASKED_ID = "you-asked";
export const YOU_ASKED_TITLE = "You asked";

/** the player feedback this patch acted on */
export function youAsked(items: readonly PatchFeedbackItem[]): HTMLElement {
  const section = el("section", "patch-section you-asked");
  section.id = YOU_ASKED_ID;
  setAccent(section, "--pink");
  const list = el("ul", "you-asked-list");
  for (const item of items) {
    const row = el("li");
    row.append(link(feedbackIssueUrl(item.id), `#${item.id}`, "you-asked-id"), el("span", undefined, item.summary));
    list.append(row);
  }
  section.append(el("h2", "section-title", YOU_ASKED_TITLE), list);
  return section;
}
