import type { WaveClear } from "../../types/records";
import { clearText } from "../../utils/records";

/** the best run's waves and time, marked when the run just played set it */
export function recordLine(best: WaveClear, isNew: boolean): HTMLElement {
  const box = document.createElement("span");
  box.className = "result-record";
  box.textContent = clearText(best);
  if (isNew) {
    const tag = document.createElement("b");
    tag.textContent = "New record";
    box.append(tag);
  }
  return box;
}
