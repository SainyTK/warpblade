import "./stageMap.css";
import { ELEMENTS } from "../../constants/elements";
import { ENEMIES } from "../../constants/enemies";
import { clearedStages, enterStage, mapChoices } from "../../game/adventure";
import { artLevel } from "../../game/arts";
import { clearPresses, releaseAll } from "../../game/input";
import { openPicks } from "../../game/progress";
import { game, progress } from "../../game/state";
import { sfx } from "../../services/audio";
import { RIFT_STAGES, STAGES } from "../../stages";
import { ARTS } from "../../stages/arts";
import type { StageDef, StageId } from "../../types/campaign";
import { el } from "../dom";
import { isMenuOpen } from "../menu/menuState";
import { foePortrait } from "./foePortrait";

const INPUT_LOCK_MS = 450;
const COLUMNS = 4;

const dialog = el("dialog", "stage-map");
dialog.setAttribute("aria-labelledby", "stageMapTitle");
dialog.innerHTML = `
  <div class="stage-map-head">
    <h2 id="stageMapTitle">Rift Map</h2>
    <p class="stage-map-sub"></p>
  </div>
  <div class="stage-map-grid" role="group" aria-label="Stages"></div>
  <div class="stage-map-tools">
    <button type="button" class="pick-tool stage-map-upgrade"><kbd>E</kbd> Upgrade skills <span class="pick-tool-count"></span></button>
  </div>
  <p class="level-up-hint keys"><kbd>A</kbd> <kbd>D</kbd> <kbd>W</kbd> <kbd>S</kbd> to choose, <kbd>J</kbd> to enter</p>
  <p class="level-up-hint touch-hint">Tap a stage to enter it</p>`;
const sub = dialog.querySelector(".stage-map-sub") as HTMLElement;
const grid = dialog.querySelector(".stage-map-grid") as HTMLElement;
const upgrade = dialog.querySelector(".stage-map-upgrade") as HTMLButtonElement;
const upgradeCount = upgrade.querySelector(".pick-tool-count") as HTMLElement;

let shown: StageId[] = [];
let selected = 0;
let shownAt = 0;

const locked = (): boolean => performance.now() - shownAt < INPUT_LOCK_MS;

function weakNote(stage: StageDef): string {
  if (!stage.weakTo || artLevel(stage.weakTo) <= 0) return "";
  return `Weak to ${ARTS[stage.weakTo].name}`;
}

const PORTRAIT_BOX = 84;
const PORTRAIT_WIDE = 190;
const PORTRAIT_MOST = 3;
const PORTRAIT_STEP = 0.5;

function fitPortrait(img: HTMLImageElement): void {
  const tall = img.naturalHeight;
  const fit = Math.min(PORTRAIT_BOX / tall, PORTRAIT_WIDE / img.naturalWidth, PORTRAIT_MOST);
  const scale = Math.max(PORTRAIT_STEP, Math.floor(fit / PORTRAIT_STEP) * PORTRAIT_STEP);
  img.style.width = `${img.naturalWidth * scale}px`;
  img.style.height = `${tall * scale}px`;
}

function stageCard(id: StageId, index: number, open: boolean): HTMLButtonElement {
  const stage = STAGES[id];
  const card = el("button", "stage-card");
  card.type = "button";
  card.dataset.index = String(index);
  card.disabled = !open;
  card.classList.toggle("cleared", !open);
  const art = stage.grantsArt ? ARTS[stage.grantsArt] : null;
  if (art) card.style.setProperty("--accent", ELEMENTS[art.element].color);
  if (art) card.style.setProperty("--accent-dark", ELEMENTS[art.element].dark);
  const portrait = el("img", "stage-card-boss");
  portrait.addEventListener("load", () => fitPortrait(portrait), { once: true });
  portrait.src = foePortrait(stage.boss);
  portrait.alt = ENEMIES[stage.boss].name;
  const name = el("span", "stage-card-name", stage.name);
  const boss = el("span", "stage-card-foe", ENEMIES[stage.boss].name);
  const reward = el("span", "stage-card-art", art ? art.name : stage.mapBlurb);
  const note = el("span", "stage-card-note", open ? weakNote(stage) : "Cleared");
  card.append(portrait, name, boss, reward, note);
  card.style.setProperty("--delay", `${index * 30}ms`);
  return card;
}

function layout(): void {
  const open = mapChoices();
  const finale = open.length === 1 && open[0] === "citadel";
  shown = finale ? ["citadel"] : [...RIFT_STAGES];
  const cleared = clearedStages();
  const done = RIFT_STAGES.filter((id) => cleared.includes(id)).length;
  sub.textContent = finale
    ? "Every rift is sealed. The Citadel is open."
    : `Choose your next stage. Rifts sealed ${done} of ${RIFT_STAGES.length}.`;
  grid.dataset.count = String(shown.length);
  grid.replaceChildren(...shown.map((id, i) => stageCard(id, i, open.includes(id))));
  selected = Math.max(
    0,
    shown.findIndex((id) => open.includes(id)),
  );
  showUpgrade();
  select(selected);
}

function showUpgrade(): void {
  upgrade.disabled = progress.picks <= 0;
  upgradeCount.textContent = String(progress.picks);
}

function select(index: number): void {
  const count = shown.length;
  selected = ((index % count) + count) % count;
  grid.querySelectorAll<HTMLButtonElement>(".stage-card").forEach((card, i) => {
    card.classList.toggle("selected", i === selected);
    if (i === selected) card.focus({ preventScroll: true });
  });
}

function close(): void {
  dialog.close();
  releaseAll();
  clearPresses();
}

function enter(index: number): void {
  const id = shown[index];
  if (!id || locked() || !mapChoices().includes(id)) return;
  sfx.mapSelect();
  close();
  enterStage(id);
}

function goUpgrade(): void {
  if (locked() || progress.picks <= 0) return;
  close();
  openPicks("map");
}

function step(by: number): void {
  sfx.menuMove();
  select(selected + by);
}

const KEYS: Record<string, () => void> = {
  ArrowLeft: () => step(-1),
  KeyA: () => step(-1),
  ArrowRight: () => step(1),
  KeyD: () => step(1),
  ArrowUp: () => step(-COLUMNS),
  KeyW: () => step(-COLUMNS),
  ArrowDown: () => step(COLUMNS),
  KeyS: () => step(COLUMNS),
  KeyJ: () => enter(selected),
  Enter: () => enter(selected),
  Space: () => enter(selected),
  KeyE: goUpgrade,
};

export function bindStageMap(): void {
  document.body.append(dialog);
  grid.addEventListener("click", (ev) => {
    const card = (ev.target as HTMLElement).closest<HTMLElement>(".stage-card");
    if (card) enter(Number(card.dataset.index));
  });
  grid.addEventListener("pointerover", (ev) => {
    const card = (ev.target as HTMLElement).closest<HTMLElement>(".stage-card");
    if (card && ev.pointerType === "mouse") select(Number(card.dataset.index));
  });
  upgrade.addEventListener("click", goUpgrade);
  dialog.addEventListener("cancel", (ev) => ev.preventDefault());
  dialog.addEventListener("keydown", (ev) => {
    const run = KEYS[ev.code];
    if (!run) return;
    ev.preventDefault();
    if (!ev.repeat) run();
  });
}

export function syncStageMap(): void {
  if (dialog.open && game.mode !== "map") close();
  if (dialog.open) return showUpgrade();
  if (game.mode !== "map" || isMenuOpen()) return;
  releaseAll();
  dialog.showModal();
  shownAt = performance.now();
  layout();
}
