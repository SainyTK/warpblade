import "./unlocks.css";
import type { Discovery } from "../../types/unlock";
import { DISCOVERY_LABEL, discoveryName } from "../../utils/unlocks";
import { discoveryIconUrl, iconImage } from "./unlockIcon";

/** at most this many finds are named; the rest are counted */
const SHOWN = 4;

/** what a run found, for the end of run screen: each with its icon, name and whether it is a find or a recipe */
export function foundList(list: readonly Discovery[]): HTMLElement {
  const box = document.createElement("ul");
  box.className = "result-found result-ach";
  box.setAttribute("aria-label", "Found this run");
  for (const d of list.slice(0, SHOWN)) {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = discoveryName(d);
    const kind = document.createElement("small");
    kind.textContent = DISCOVERY_LABEL[d.type].list;
    row.append(iconImage(discoveryIconUrl(d)), name, kind);
    box.append(row);
  }
  if (list.length > SHOWN) {
    const more = document.createElement("li");
    more.className = "result-ach-more";
    more.textContent = `and ${list.length - SHOWN} more`;
    box.append(more);
  }
  return box;
}
