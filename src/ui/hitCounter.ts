import { HIT_COUNT } from "../constants/combat";
import { hero } from "../game/state";
import { byId } from "./dom";

/** The hit counter beside the stage: the hero's hits in a row, popping on every new hit and warmer at each tier. */
const box = byId("hitCount");
const number = byId("hitCountNumber");
let shown = 0;

export function updateHitCounter(): void {
  const count = hero.hitCount >= HIT_COUNT.from ? hero.hitCount : 0;
  if (count === shown) return;
  const grew = count > shown;
  shown = count;
  box.classList.toggle("show", count > 0);
  if (!count) return;
  number.textContent = String(count);
  box.dataset.tier = String(HIT_COUNT.tiers.filter((t) => count >= t).length);
  if (!grew) return;
  // restart the pop for this hit
  box.classList.remove("pop");
  void box.offsetWidth;
  box.classList.add("pop");
}
