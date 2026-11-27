import "../achievements/achievements.css";
import "./unlocks.css";
import { onDiscovery } from "../../store/unlocks";
import type { Discovery } from "../../types/unlock";
import { discoveryLabel, discoveryName } from "../../utils/unlocks";
import { showToast } from "../achievements/toastQueue";
import { discoveryIconUrl, iconImage } from "./unlockIcon";

function toast(d: Discovery): HTMLElement {
  const box = document.createElement("div");
  box.className = "ach-toast found-toast";
  box.setAttribute("role", "status");
  const text = document.createElement("span");
  text.className = "ach-toast-text";
  const label = document.createElement("small");
  label.textContent = discoveryLabel(d).toast;
  const name = document.createElement("b");
  name.textContent = discoveryName(d);
  box.setAttribute("aria-label", `${label.textContent}: ${name.textContent}`);
  text.append(label, name);
  box.append(iconImage(discoveryIconUrl(d), "found-icon"), text);
  return box;
}

/** the achievement banner, in crystal, for every charm, slot, recipe or job found, in play or in the menu */
export function bindDiscoveryToasts(): void {
  onDiscovery((d) => showToast(toast(d)));
}
