import { prefersReducedMotion } from "../../services/reducedMotion";
import { el, link } from "../dom";

export interface ContentsItem {
  id: string;
  title: string;
}

/** jumps to a section without touching the address, which names the patch */
function jump(event: MouseEvent, id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  target.focus({ preventScroll: true });
}

/** a short jump list of the sections this patch has */
export function contentsList(items: readonly ContentsItem[]): HTMLElement {
  const nav = el("nav", "patch-contents");
  nav.setAttribute("aria-labelledby", "contents-title");
  const title = el("h2", "contents-title", "Contents");
  title.id = "contents-title";
  const list = el("ol", "contents-list");
  for (const item of items) {
    const entry = link(`#${item.id}`, item.title);
    entry.addEventListener("click", (event) => jump(event, item.id));
    const row = el("li");
    row.append(entry);
    list.append(row);
  }
  nav.append(title, list);
  return nav;
}
