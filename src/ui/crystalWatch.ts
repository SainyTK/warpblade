import { crystalWatch, isAdventure } from "../game/adventure";
import { guestCrystal } from "../game/coop/guestCrystal";
import { game } from "../game/state";
import { minutesSeconds } from "../utils/runReport";
import { byId } from "./dom";

const watch = byId("crystalWatch");
const clock = byId("crystalClock");
const fill = byId("crystalFill");
let shown = "";

export function updateCrystalWatch(): void {
  const view = isAdventure() ? crystalWatch(game.t) : guestCrystal();
  const left = Math.ceil(view?.secondsLeft ?? 0);
  const key = view ? [left, Math.round(view.share * 200), view.low, view.struck].join() : "";
  if (key === shown) return;
  shown = key;
  watch.hidden = !view;
  if (!view) return;
  clock.textContent = minutesSeconds(left);
  fill.style.width = `${view.share * 100}%`;
  watch.classList.toggle("low", view.low);
  watch.classList.toggle("struck", view.struck);
}
