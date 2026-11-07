import { el } from "../dom";
import type { CardFace } from "./cardFace";
import { iconUrl } from "./icons/iconImage";

/** level or rank pips: those held, the one this card adds, and the ones still to come */
function levelPips(total: number, had: number): HTMLSpanElement {
  const pips = el("span", "pick-pips");
  for (let i = 0; i < total; i++) pips.append(el("i", i < had ? "had" : i === had ? "gain" : ""));
  return pips;
}

/** one card of a pick, as a button */
export function pickCard(face: CardFace, index: number): HTMLButtonElement {
  const b = el("button", "pick");
  b.type = "button";
  b.dataset.index = String(index);
  b.dataset.branch = face.branch;
  if (face.kind) b.dataset.kind = face.kind;
  b.style.setProperty("--delay", `${index * 70}ms`);
  const icon = el("img", "");
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;
  icon.src = iconUrl(face.icon);
  const frame = el("span", "pick-icon");
  frame.append(icon);
  if (face.isNew) frame.append(el("span", "pick-new", "NEW"));
  const body = el("span", "pick-body");
  body.append(el("span", "pick-name", face.name));
  if (face.line || face.pips) {
    const meta = el("span", "pick-meta");
    if (face.line) meta.append(el("span", "pick-kind", face.line));
    if (face.pips) meta.append(levelPips(face.pips.total, face.pips.had));
    body.append(meta);
  }
  body.append(el("span", "pick-text", face.text));
  for (const note of face.notes) body.append(el("span", `pick-note pick-${note.tone}`, note.text));
  const key = el("span", "pick-key", String(index + 1));
  key.setAttribute("aria-hidden", "true");
  b.append(el("span", "pick-path", face.path), frame, body, key);
  return b;
}
