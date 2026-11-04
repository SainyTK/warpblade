import type { PatchHighlight } from "../../types/patch";
import { el } from "../dom";
import { mediaBox } from "./mediaBox";

/** a headline change of a big patch: its clip or picture, then the title and text */
export function highlightCard(highlight: PatchHighlight, version: string): HTMLElement {
  const card = el("article", "highlight-card panel");
  const body = el("div", "highlight-body");
  body.append(el("h3", "highlight-title", highlight.title), el("p", "highlight-text", highlight.text));
  card.append(mediaBox(highlight.media, version, "highlight-media"), body);
  return card;
}
