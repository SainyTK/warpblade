import "./pickDialog.css";
import { BOONS } from "../../constants/boons";
import { cardView } from "../../game/build/cardView";
import { clearPresses, releaseAll } from "../../game/input";
import { answerPick } from "../../game/progress";
import { character, game, progress, rng } from "../../game/state";
import { sfx } from "../../services/audio";
import type { Card } from "../../types/build";
import type { PickAnswer } from "../../types/pick";
import { buildStats } from "../../utils/build";
import { cardCount, cardKey, dealCards } from "../../utils/cards";
import { el } from "../dom";
import { buildKey, buildSlots } from "./buildSlots";
import { cardFace } from "./cardFace";
import { pickCard } from "./pickCard";
import { createPickTools, type PickTool } from "./pickTools";

/** input this soon after the cards appear is ignored, so a J or a tap mashed mid-fight picks nothing by accident */
const INPUT_LOCK_MS = 450;

const dialog = el("dialog", "level-up");
dialog.setAttribute("aria-labelledby", "levelUpTitle");
dialog.innerHTML = `
  <div class="level-up-head">
    <h2 id="levelUpTitle"></h2>
    <p class="level-up-sub"></p>
  </div>
  <div class="level-up-build" aria-label="Your skills and charms"></div>
  <div class="level-up-cards" role="group" aria-label="Cards to choose from"></div>
  <p class="level-up-hint keys"><kbd>A</kbd> <kbd>D</kbd> to choose, <kbd>J</kbd> to take</p>
  <p class="level-up-hint touch-hint">Tap a card to take it</p>
  <p class="level-up-hint banish-hint">Choose a card to banish for this run. <kbd class="keys">B</kbd><span class="keys"> to cancel</span></p>`;
const title = dialog.querySelector("h2") as HTMLElement;
const sub = dialog.querySelector(".level-up-sub") as HTMLElement;
const build = dialog.querySelector(".level-up-build") as HTMLElement;
const cards = dialog.querySelector(".level-up-cards") as HTMLElement;
const tools = createPickTools(useTool);
cards.after(tools.root);

/** where the cards come from and where an answer goes: solo play acts at once, a co-op room may send it to the host */
export interface PickSource {
  /** this player has a card to choose now */
  waiting(): boolean;
  answer(answer: PickAnswer<Card>): void;
}
const SOLO: PickSource = { waiting: () => game.mode === "pick", answer: answerPick };
let source: PickSource = SOLO;

/** a co-op room takes the cards over until called with null; cards dealt for the old source are put away */
export function setPickSource(next: PickSource | null): void {
  source = next ?? SOLO;
  dealtFor = "";
  if (dialog.open) close();
}

let dealt: Card[] = [];
let selected = 0;
let shownAt = 0;
/** B was pressed: the next card chosen is banished */
let banishing = false;
/** the pick the cards on the table were dealt for, so cards put away under a room's pause menu come back the same */
let dealtFor = "";
/** what the tools and slots last showed */
let shownBuild = "";

const pickKey = (): string => `${game.wave}:${progress.level}:${progress.picks}`;

const locked = (): boolean => performance.now() - shownAt < INPUT_LOCK_MS;

function select(index: number): void {
  selected = (index + dealt.length) % dealt.length;
  cards.querySelectorAll<HTMLButtonElement>(".pick").forEach((card, i) => {
    card.classList.toggle("selected", i === selected);
    if (i === selected) card.focus({ preventScroll: true });
  });
}

/** the slots and tool counts, redrawn when the build changed */
function showBuild(): void {
  const b = progress.build;
  const key = `${buildKey(b)}${b.rerolls}${b.skips}${b.banishes}${banishing}`;
  if (key === shownBuild) return;
  shownBuild = key;
  build.replaceChildren(...buildSlots(b));
  tools.update(b, banishing);
  dialog.classList.toggle("banishing", banishing);
}

/** deal fresh cards for the oldest waiting pick and lay them out; `without` are left out, as after a reroll */
function deal(without: readonly string[] = []): void {
  dealt = dealCards(character, cardView(), rng, cardCount(buildStats(progress.build).luck, rng), BOONS, without);
  banishing = false;
  title.textContent = `Wave ${game.wave} clear`;
  const more = progress.picks - 1;
  sub.textContent = more > 0 ? `Choose one. ${more} more pick${more === 1 ? "" : "s"} after this.` : "Choose one.";
  cards.dataset.count = String(dealt.length);
  cards.replaceChildren(...dealt.map((card, i) => pickCard(cardFace(character, card, progress.build), i)));
  dealtFor = pickKey();
  shownAt = performance.now();
  shownBuild = "";
  showBuild();
  select(0);
}

function close(): void {
  dialog.close();
  releaseAll();
  clearPresses();
}

/** the answer is given: the next pick is dealt, or the game plays on */
function answer(a: PickAnswer<Card>, without: readonly string[] = []): void {
  dealtFor = "";
  source.answer(a);
  if (source.waiting()) deal(without);
  else close();
}

function take(index: number): void {
  const card = dealt[index];
  if (!card || locked()) return;
  if (banishing) return banish(card);
  sfx.learn();
  answer({ t: "take", card });
}

function banish(card: Card): void {
  if (card.type === "boon") return;
  sfx.learn();
  answer({ t: "banish", card }, [cardKey(card)]);
}

function useTool(tool: PickTool): void {
  if (locked()) return;
  const b = progress.build;
  if (tool === "reroll" && b.rerolls > 0) answer({ t: "reroll" }, dealt.map(cardKey));
  else if (tool === "skip" && b.skips > 0) answer({ t: "skip" });
  else if (tool === "banish" && (banishing || b.banishes > 0)) {
    banishing = !banishing;
    showBuild();
    return;
  } else return;
  sfx.learn();
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
  Digit4: () => take(3),
  KeyR: () => useTool("reroll"),
  KeyX: () => useTool("skip"),
  KeyB: () => useTool("banish"),
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
  if (dialog.open) return showBuild();
  if (!source.waiting()) return;
  releaseAll();
  dialog.showModal();
  if (dealtFor !== pickKey()) return deal();
  shownAt = performance.now();
  select(selected);
}
