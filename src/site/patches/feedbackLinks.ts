import { feedbackIssueUrl } from "../../constants/feedback";
import { el, link } from "../dom";

/** "From player feedback #12, #15" */
export function feedbackLinks(ids: readonly number[]): HTMLParagraphElement {
  const line = el("p", "entry-feedback", "From player feedback ");
  ids.forEach((id, index) => {
    if (index > 0) line.append(", ");
    line.append(link(feedbackIssueUrl(id), `#${id}`));
  });
  return line;
}
