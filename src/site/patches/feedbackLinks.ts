import { el, link } from "../dom";

/** the feedback page address of one item */
export const feedbackHref = (id: number): string => `/feedback/#${id}`;

/** "From player feedback #12, #15" */
export function feedbackLinks(ids: readonly number[]): HTMLParagraphElement {
  const line = el("p", "entry-feedback", "From player feedback ");
  ids.forEach((id, index) => {
    if (index > 0) line.append(", ");
    line.append(link(feedbackHref(id), `#${id}`));
  });
  return line;
}
