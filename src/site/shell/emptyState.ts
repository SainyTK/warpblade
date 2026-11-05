import { el, link } from "../dom";

/** one short line, with an optional way onward */
export function emptyState(text: string, action?: { href: string; label: string }): HTMLElement {
  const box = el("div", "state-box");
  box.append(el("p", "state-text", text));
  if (action) box.append(link(action.href, action.label, "button"));
  return box;
}
