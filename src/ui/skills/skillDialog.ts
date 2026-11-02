import { KIND_LABEL, PACE_LABEL, SPECIAL_TEXT } from "../../constants/skillLabels";
import { clearPresses, releaseAll } from "../../game/input";
import { learnSkill } from "../../game/progress";
import { character, game, progress } from "../../game/state";
import { sfx } from "../../services/audio";
import type { SkillNode } from "../../types/skill";
import { nodeStatus } from "../../utils/skillTree";
import { allNodes } from "../../utils/stats";
import { byId } from "../dom";
import { drawLinks } from "./drawLinks";
import { iconUrl } from "./icons/iconImage";
import { statusText } from "./nodeText";
import { renderTree, SPECIAL_ID } from "./renderTree";

const dialog = byId<HTMLDialogElement>("skills");
const tree = byId("skillBranches");
const summary = byId("skillsSummary");
const continueButton = byId<HTMLButtonElement>("skillsContinue");
const learnButton = byId<HTMLButtonElement>("detailLearn");
const detailIcon = byId<HTMLImageElement>("detailIcon");
const detailName = byId("detailName");
const detailKind = byId("detailKind");
const detailText = byId("detailText");
const detailPath = byId("detailPath");
const detailStatus = byId("detailStatus");
/** keys pressed this soon after opening are ignored, so a J mashed at the end of a wave learns nothing */
const INPUT_LOCK_MS = 450;

let selected = SPECIAL_ID;
let openedAt = 0;

const nodeById = (id: string): SkillNode | undefined => allNodes(character).find((n) => n.id === id);
const branchOf = (node: SkillNode) => character.branches.find((b) => b.nodes.includes(node));

function firstUseful(): string {
  return allNodes(character).find((n) => nodeStatus(character, n, progress) === "learnable")?.id ?? SPECIAL_ID;
}

function showDetail(): void {
  const node = nodeById(selected);
  detailIcon.src = iconUrl(selected);
  if (!node) {
    detailName.textContent = SPECIAL_TEXT.name;
    detailKind.textContent = SPECIAL_TEXT.kind;
    detailText.textContent = SPECIAL_TEXT.text;
    detailPath.textContent = "";
    detailStatus.textContent = "Known.";
    learnButton.disabled = true;
    return;
  }
  const rank = progress.ranks[node.id] ?? 0;
  const status = nodeStatus(character, node, progress);
  const branch = branchOf(node);
  detailName.textContent = node.name;
  detailKind.textContent = `${KIND_LABEL[node.kind]}${node.ranks > 1 ? `, ${node.ranks} ranks` : ""}`;
  detailText.textContent = node.text;
  detailPath.textContent = branch
    ? `${branch.name}${branch.pace ? ` path, ${PACE_LABEL[branch.pace].toLowerCase()}` : ""}: ${branch.pros} ${branch.cons}`
    : "";
  detailStatus.textContent = statusText(character, node, rank, status);
  learnButton.disabled = status !== "learnable";
}

function render(focus: boolean): void {
  const pts = progress.points;
  summary.textContent = `${character.name}, level ${progress.level}. ${pts ? `${pts} skill point${pts === 1 ? "" : "s"} to spend.` : "No skill points to spend."}`;
  const scroll = [tree.scrollLeft, tree.scrollTop];
  renderTree(tree, character, progress);
  [tree.scrollLeft, tree.scrollTop] = scroll;
  drawLinks(tree, character, progress, selected);
  const tileEl = tree.querySelector<HTMLButtonElement>(`.node[data-id="${selected}"]`);
  tileEl?.classList.add("selected");
  if (focus) {
    tileEl?.focus({ preventScroll: true });
    tileEl?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  showDetail();
}

function select(id: string, focus = true): void {
  selected = id;
  render(focus);
}

function learn(): void {
  const node = nodeById(selected);
  if (!node || !learnSkill(node)) return;
  sfx.learn();
  render(true);
}

function close(): void {
  if (dialog.open) dialog.close();
  releaseAll();
  clearPresses();
  game.mode = "play";
}

/** arrow keys move to the nearest tile in that direction, preferring tiles straight along it */
function step(dx: number, dy: number): void {
  const tiles = [...tree.querySelectorAll<HTMLElement>(".node")];
  const here = tiles.find((t) => t.dataset.id === selected)?.getBoundingClientRect();
  if (!here) return;
  const cx = here.left + here.width / 2;
  const cy = here.top + here.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const t of tiles) {
    const r = t.getBoundingClientRect();
    const ox = r.left + r.width / 2 - cx;
    const oy = r.top + r.height / 2 - cy;
    const along = ox * dx + oy * dy;
    if (along <= 4) continue;
    const across = Math.abs(ox * dy) + Math.abs(oy * dx);
    const score = along + across * 2.5;
    if (score < bestScore) {
      bestScore = score;
      best = t;
    }
  }
  if (best?.dataset.id) select(best.dataset.id);
}

const KEYS: Record<string, () => void> = {
  ArrowUp: () => step(0, -1),
  KeyW: () => step(0, -1),
  ArrowDown: () => step(0, 1),
  KeyS: () => step(0, 1),
  ArrowLeft: () => step(-1, 0),
  KeyA: () => step(-1, 0),
  ArrowRight: () => step(1, 0),
  KeyD: () => step(1, 0),
  KeyJ: learn,
  Enter: learn,
};

export function bindSkillDialog(): void {
  tree.addEventListener("click", (ev) => {
    const id = (ev.target as HTMLElement).closest<HTMLElement>(".node")?.dataset.id;
    if (id) select(id);
  });
  learnButton.addEventListener("click", learn);
  continueButton.addEventListener("click", close);
  dialog.addEventListener("cancel", (ev) => {
    ev.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", (ev) => {
    const run = KEYS[ev.code];
    if (!run) return;
    ev.preventDefault();
    if (ev.repeat || performance.now() - openedAt < INPUT_LOCK_MS) return;
    run();
  });
  new ResizeObserver(() => {
    if (dialog.open) drawLinks(tree, character, progress, selected);
  }).observe(tree);
}

/** open the tree when the game asks for it */
export function syncSkillDialog(): void {
  if (game.mode !== "skills" || dialog.open) return;
  releaseAll();
  openedAt = performance.now();
  dialog.showModal();
  select(firstUseful());
}
