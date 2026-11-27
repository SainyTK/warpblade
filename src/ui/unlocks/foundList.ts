import "./unlocks.css";
import type { Discovery } from "../../types/unlock";
import { discoveryLabel, discoveryName } from "../../utils/unlocks";
import { discoveryIconUrl, iconImage } from "./unlockIcon";

/** at most this many finds are named; the rest are counted */

/** what a run found, for the end of run screen: each with its icon, name and whether it is a find or a recipe */
export function foundList(list: readonly Discovery[], shown = 4): HTMLElement {
  const box = document.createElement("ul");
  box.className = "result-found result-ach";
  box.setAttribute("aria-label", "Found this run");
  for (const d of list.slice(0, shown)) {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = discoveryName(d);
    const kind = document.createElement("small");
    kind.textContent = discoveryLabel(d).list;
    row.append(iconImage(discoveryIconUrl(d)), name, kind);
    box.append(row);
  }
  if (list.length > shown) {
    const more = document.createElement("li");
    more.className = "result-ach-more";
    more.textContent = `and ${list.length - shown} more`;
    box.append(more);
  }
  return box;
}
