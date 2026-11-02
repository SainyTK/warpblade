import { keyName } from "../../utils/keymap";
import { pixelArrow } from "./pixelArrow";

const ARROWS: Record<string, "up" | "down" | "left" | "right"> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

/** one key drawn as a keycap; arrow keys show a pixel arrow */
export function keycap(code: string): HTMLElement {
  const cap = document.createElement("kbd");
  cap.className = "cap";
  const arrow = ARROWS[code];
  if (arrow) {
    cap.setAttribute("aria-label", keyName(code));
    cap.append(pixelArrow(arrow));
  } else {
    cap.textContent = keyName(code);
    if (cap.textContent.length > 1) cap.classList.add("cap-wide");
  }
  return cap;
}
