import { PACE_LABEL, SPECIAL_TEXT } from "../../constants/skillLabels";
import type { CharacterDef } from "../../types/character";
import type { Progress } from "../../types/progress";
import type { SkillBranch, SkillNode } from "../../types/skill";
import { nodeStatus } from "../../utils/skillTree";
import { iconUrl } from "./icons/iconImage";
import { nodeMeta } from "./nodeText";

/** the id the starting special uses in the tree */
export const SPECIAL_ID = "special";
/** grid columns before the first tier: the lane name, then the starting special */
const LEAD_COLUMNS = 2;

function tile(id: string, name: string, meta: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "node";
  b.dataset.id = id;
  const icon = document.createElement("img");
  icon.src = iconUrl(id);
  icon.alt = "";
  icon.width = 32;
  icon.height = 32;
  const label = document.createElement("span");
  label.className = "name";
  label.textContent = name;
  const sub = document.createElement("span");
  sub.className = "meta";
  sub.textContent = meta;
  b.append(icon, label, sub);
  return b;
}

function nodeTile(c: CharacterDef, node: SkillNode, p: Progress): HTMLButtonElement {
  const rank = p.ranks[node.id] ?? 0;
  const status = nodeStatus(c, node, p);
  const b = tile(node.id, node.name, nodeMeta(node, rank, status, p.level));
  if (rank) b.classList.add("learned");
  b.dataset.status = status;
  b.dataset.kind = node.kind;
  return b;
}

function laneLabel(branch: SkillBranch, row: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "lane";
  el.style.gridRow = String(row);
  el.innerHTML = `<h3>${branch.name}</h3>${branch.pace ? `<span class="pace">${PACE_LABEL[branch.pace]}</span>` : ""}`;
  return el;
}

/** one cell per tier: the nodes of that tier stacked, with "or" between nodes that exclude each other */
function tierCell(c: CharacterDef, nodes: SkillNode[], p: Progress, row: number): HTMLElement {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.style.gridRow = String(row);
  cell.style.gridColumn = String(nodes[0].tier + LEAD_COLUMNS);
  nodes.forEach((node, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "or";
      sep.textContent = node.group && node.group === nodes[i - 1].group ? "or" : "";
      cell.append(sep);
    }
    cell.append(nodeTile(c, node, p));
  });
  return cell;
}

/** Paths run left to right as lanes, starting from the special Kael already knows; lines are drawn afterwards. */
export function renderTree(root: HTMLElement, c: CharacterDef, p: Progress): void {
  const tiers = Math.max(...c.branches.flatMap((b) => b.nodes.map((n) => n.tier)));
  root.style.setProperty("--tiers", String(tiers));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("links");
  const special = tile(SPECIAL_ID, SPECIAL_TEXT.name, "Special");
  special.classList.add("learned", "special");
  special.style.gridRow = `1 / span ${c.branches.length}`;
  special.style.gridColumn = "2";
  const parts: Element[] = [svg, special];
  c.branches.forEach((branch, i) => {
    const row = i + 1;
    parts.push(laneLabel(branch, row));
    const byTier = new Map<number, SkillNode[]>();
    for (const n of branch.nodes) byTier.set(n.tier, [...(byTier.get(n.tier) ?? []), n]);
    for (const nodes of byTier.values()) parts.push(tierCell(c, nodes, p, row));
  });
  root.replaceChildren(...parts);
}
