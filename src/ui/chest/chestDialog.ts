import "./chestDialog.css";
import { clearPresses, releaseAll } from "../../game/input";
import { seeChest } from "../../game/progress";
import { game, progress } from "../../game/state";
import { el } from "../dom";
import { chestReward } from "./chestReward";

/** input this soon after the screen appears is ignored, so a J mashed mid-fight does not wave the rewards away unseen */
const INPUT_LOCK_MS = 600;

const dialog = el("dialog", "chest-screen");
dialog.setAttribute("aria-labelledby", "chestTitle");
dialog.innerHTML = `
  <h2 id="chestTitle"></h2>
  <ul class="chest-rewards"></ul>
  <p class="chest-hint keys"><kbd>J</kbd> to continue</p>
  <p class="chest-hint touch-hint">Tap to continue</p>`;
const title = dialog.querySelector("h2") as HTMLElement;
const list = dialog.querySelector("ul") as HTMLElement;

/** where the chest screen reads from and where "seen" goes: solo play at once, a co-op guest to the host */
export interface ChestSource {
  /** this player has an opened chest to look at */
  waiting(): boolean;
  seen(): void;
}
const SOLO: ChestSource = { waiting: () => game.mode === "chest" && progress.build.chest.length > 0, seen: seeChest };
let source: ChestSource = SOLO;
let shownAt = 0;

/** a co-op room takes the chest screen over until called with null */
export function setChestSource(next: ChestSource | null): void {
  source = next ?? SOLO;
  if (dialog.open) close();
}

function close(): void {
  dialog.close();
  releaseAll();
  clearPresses();
}

function proceed(): void {
  if (performance.now() - shownAt < INPUT_LOCK_MS) return;
  source.seen();
  close();
}

function show(): void {
  const rewards = progress.build.chest;
  const evolved = rewards.some((r) => r.type === "evolve");
  dialog.dataset.kind = evolved ? "evolve" : "";
  title.textContent = evolved ? "Evolution" : rewards.length > 1 ? `Chest: ${rewards.length} upgrades` : "Chest";
  list.replaceChildren(...rewards.map(chestReward));
  releaseAll();
  dialog.showModal();
  shownAt = performance.now();
}

export function bindChestDialog(): void {
  document.body.append(dialog);
  dialog.addEventListener("cancel", (ev) => ev.preventDefault());
  dialog.addEventListener("click", proceed);
  dialog.addEventListener("keydown", (ev) => {
    if (ev.code !== "KeyJ" && ev.code !== "Enter" && ev.code !== "Space") return;
    ev.preventDefault();
    if (!ev.repeat) proceed();
  });
}

/** open the chest screen when the hero in play has opened a chest, and put it away once the room moves on */
export function syncChestDialog(): void {
  if (dialog.open && !source.waiting()) close();
  if (!dialog.open && source.waiting()) show();
}
