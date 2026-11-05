import "./pickDialog.css";
import { BOONS } from "../../constants/boons";
import { PICK_COUNT } from "../../constants/progression";
import { clearPresses, releaseAll } from "../../game/input";
import { choosePick } from "../../game/progress";
import { character, game, progress, rng } from "../../game/state";
import { sfx } from "../../services/audio";
import type { PickOption } from "../../types/skill";
import { rollPicks } from "../../utils/skillPicks";
import { pickCard } from "./pickCard";

/** input this soon after the cards appear is ignored, so a J or a tap mashed mid-fight picks nothing by accident */
const INPUT_LOCK_MS = 450;

const dialog = document.createElement("dialog");
dialog.className = "level-up";
dialog.setAttribute("aria-labelledby", "levelUpTitle");
dialog.innerHTML = `
  <div class="level-up-head">
    <h2 id="levelUpTitle"></h2>
    <p class="level-up-sub"></p>
  </div>
  <div class="level-up-cards" role="group" aria-label="Skills to choose from"></div>
  <p class="level-up-hint keys"><kbd>A</kbd> <kbd>D</kbd> or arrows to choose, <kbd>J</kbd> or <kbd>Enter</kbd> to learn</p>
  <p class="level-up-hint touch-hint">Tap a card to learn it</p>`;
const title = dialog.querySelector("h2") as HTMLElement;
const sub = dialog.querySelector(".level-up-sub") as HTMLElement;
const cards = dialog.querySelector(".level-up-cards") as HTMLElement;

/** where the cards come from and where a choice goes: solo play learns it at once, a co-op room may send it to the host */
export interface PickSource {
  /** this player has a card to choose now */
  waiting(): boolean;
  choose(option: PickOption): void;
}
const SOLO: PickSource = { waiting: () => game.mode === "pick", choose: choosePick };
let source: PickSource = SOLO;

/** a co-op room takes the cards over until called with null */
export function setPickSource(next: PickSource | null): void {
  source = next ?? SOLO;
}

let options: PickOption[] = [];
let selected = 0;
let shownAt = 0;

const locked = (): boolean => performance.now() - shownAt < INPUT_LOCK_MS;

function select(index: number): void {
  selected = (index + options.length) % options.length;
  cards.querySelectorAll<HTMLButtonElement>(".pick").forEach((card, i) => {
    card.classList.toggle("selected", i === selected);
    if (i === selected) card.focus({ preventScroll: true });
  });
}

/** roll fresh options for the oldest waiting pick and lay them out */
function deal(): void {
  options = rollPicks(character, progress, rng, PICK_COUNT, BOONS);
  title.textContent = `Wave ${game.wave} clear`;
  const more = progress.picks - 1;
  sub.textContent = more > 0 ? `Choose one. ${more} more pick${more === 1 ? "" : "s"} after this.` : "Choose one.";
  cards.dataset.count = String(options.length);
  cards.replaceChildren(...options.map((o, i) => pickCard(character, o, progress.ranks, i)));
  shownAt = performance.now();
  select(0);
}

function close(): void {
  dialog.close();
  releaseAll();
  clearPresses();
}

function take(index: number): void {
  const option = options[index];
  if (!option || locked()) return;
  source.choose(option);
  sfx.learn();
  if (source.waiting()) deal();
  else close();
}

const KEYS: Record<string, () => void> = {
  ArrowLeft: () => select(selected - 1),
  ArrowUp: () => select(selected - 1),
  KeyA: () => select(selected - 1),
  KeyW: () => select(selected - 1),
  ArrowRight: () => select(selected + 1),
  ArrowDown: () => select(selected + 1),
  KeyD: () => select(selected + 1),
  KeyS: () => select(selected + 1),
  KeyJ: () => take(selected),
  Enter: () => take(selected),
  Space: () => take(selected),
  Digit1: () => take(0),
  Digit2: () => take(1),
  Digit3: () => take(2),
};

export function bindPickDialog(): void {
  document.body.append(dialog);
  cards.addEventListener("click", (ev) => {
    const card = (ev.target as HTMLElement).closest<HTMLElement>(".pick");
    if (card) take(Number(card.dataset.index));
  });
  cards.addEventListener("pointerover", (ev) => {
    const card = (ev.target as HTMLElement).closest<HTMLElement>(".pick");
    if (card && ev.pointerType === "mouse") select(Number(card.dataset.index));
  });
  dialog.addEventListener("cancel", (ev) => ev.preventDefault());
  dialog.addEventListener("keydown", (ev) => {
    const run = KEYS[ev.code];
    if (!run) return;
    ev.preventDefault();
    if (!ev.repeat) run();
  });
}

/** open the pick when a cleared wave finds skill points waiting */
export function syncPickDialog(): void {
  if (dialog.open && source !== SOLO && !source.waiting()) close();
  if (!source.waiting() || dialog.open) return;
  releaseAll();
  dialog.showModal();
  deal();
}
