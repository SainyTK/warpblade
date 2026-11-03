import { BOON_KIND } from "../../constants/skillLabels";
import type { CharacterDef } from "../../types/character";
import type { PickOption } from "../../types/skill";
import { iconUrl } from "./icons/iconImage";
import { branchLine, lockNote, rankLine } from "./pickText";

function span(cls: string, text: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

/** rank pips: learned ranks, the one this pick adds, and the ones still to come */
function rankPips(ranks: number, rank: number): HTMLSpanElement {
  const el = span("pick-pips", "");
  for (let i = 0; i < ranks; i++) {
    const pip = document.createElement("i");
    if (i < rank) pip.className = "had";
    else if (i === rank) pip.className = "gain";
    el.append(pip);
  }
  return el;
}

/** one option of a pick, as a button card */
export function pickCard(
  c: CharacterDef,
  option: PickOption,
  ranks: Readonly<Record<string, number>>,
  index: number,
): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "pick";
  b.dataset.index = String(index);
  b.style.setProperty("--delay", `${index * 70}ms`);
  const icon = document.createElement("img");
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;
  const frame = span("pick-icon", "");
  frame.append(icon);
  const body = span("pick-body", "");
  const key = span("pick-key", String(index + 1));
  key.setAttribute("aria-hidden", "true");
  if (option.type === "boon") {
    b.dataset.branch = "boon";
    icon.src = iconUrl(option.boon.id);
    body.append(span("pick-name", option.boon.name), span("pick-text", option.boon.text));
    b.append(span("pick-path", BOON_KIND), frame, body, key);
    return b;
  }
  const { node, branch } = option;
  const rank = ranks[node.id] ?? 0;
  b.dataset.branch = branch.id;
  b.dataset.kind = node.kind;
  icon.src = iconUrl(node.id);
  const meta = span("pick-meta", "");
  meta.append(span("pick-kind", rankLine(node, rank)));
  if (node.ranks > 1) meta.append(rankPips(node.ranks, rank));
  body.append(span("pick-name", node.name), meta, span("pick-text", node.text));
  const note = lockNote(c, node, rank);
  if (note) body.append(span("pick-note", note));
  if (!rank) frame.append(span("pick-new", "NEW"));
  b.append(span("pick-path", branchLine(branch)), frame, body, key);
  return b;
}
