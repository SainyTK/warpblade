import type { CharacterDef } from "../../types/character";
import type { Progress } from "../../types/progress";
import { allNodes } from "../../utils/stats";
import { SPECIAL_ID } from "./renderTree";

const SVG = "http://www.w3.org/2000/svg";

/** the point on a tile's edge, in the tree's scrolled coordinates */
function anchor(root: HTMLElement, el: Element, side: "left" | "right"): [number, number] {
  const r = el.getBoundingClientRect();
  const o = root.getBoundingClientRect();
  return [
    (side === "left" ? r.left : r.right) - o.left + root.scrollLeft,
    r.top + r.height / 2 - o.top + root.scrollTop,
  ];
}

function path(svg: SVGSVGElement, a: [number, number], b: [number, number], cls: string): void {
  const dx = Math.max(12, (b[0] - a[0]) / 2);
  const line = document.createElementNS(SVG, "path");
  line.setAttribute("d", `M${a[0]} ${a[1]} C${a[0] + dx} ${a[1]} ${b[0] - dx} ${b[1]} ${b[0]} ${b[1]}`);
  line.setAttribute("class", cls);
  svg.append(line);
}

/** Lines from each skill to the skills it opens: bright once both ends are learned, lit when the next step is open.
 *  Lines into fusion skills cross the paths, so they stay faint unless one of their ends is the selected skill. */
export function drawLinks(root: HTMLElement, c: CharacterDef, p: Progress, selected: string): void {
  const svg = root.querySelector<SVGSVGElement>("svg.links");
  if (!svg) return;
  svg.replaceChildren();
  svg.setAttribute("width", String(root.scrollWidth));
  svg.setAttribute("height", String(root.scrollHeight));
  const tileOf = (id: string) => root.querySelector(`.node[data-id="${id}"]`);
  const learned = (id: string) => id === SPECIAL_ID || (p.ranks[id] ?? 0) > 0;
  const state = (from: string, to: string) => (learned(from) && learned(to) ? "on" : learned(from) ? "open" : "off");
  for (const node of allNodes(c)) {
    const to = tileOf(node.id);
    if (!to) continue;
    const end = anchor(root, to, "left");
    const fusion = !!node.crossRequires;
    const parents = node.requires.length || fusion ? [...node.requires, ...(node.crossRequires ?? [])] : [SPECIAL_ID];
    for (const id of parents) {
      const from = tileOf(id);
      if (!from) continue;
      const focus = id === selected || node.id === selected ? " focus" : "";
      path(svg, anchor(root, from, "right"), end, `${state(id, node.id)}${fusion ? " fusion" : ""}${focus}`);
    }
  }
}
