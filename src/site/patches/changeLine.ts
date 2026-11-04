import type { PatchChange } from "../../types/patch";
import { pixelArrow } from "../../ui/menu/pixelArrow";
import { el } from "../dom";

/** "Label: before -> after" with a pixel arrow, or a plain line */
export function changeLine(change: PatchChange): HTMLLIElement {
  if (change.kind === "note") return el("li", "change", change.text);
  const line = el("li", "change change-stat");
  line.append(
    el("span", "change-label", `${change.label}:`),
    " ",
    el("span", "change-before", change.before),
    pixelArrow("right"),
    el("span", "visually-hidden", " to "),
    el("span", "change-after", change.after),
  );
  return line;
}
