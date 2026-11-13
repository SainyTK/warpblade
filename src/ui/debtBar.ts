import { DEBT } from "../constants/brannoc/fury";
import { bloodiedLine } from "../game/hero/brannoc/fury";
import { brannoc } from "../game/hero/brannoc/memory";
import { character, hero, progress } from "../game/state";
import { byId } from "./dom";

/**
 * Brannoc's debt on his HP bar: a crimson segment right after the fill, as wide as the HP he can still win back, that
 * brightens on a repay, pulses while it fades, and on a forfeit flashes white and breaks into shards; and a one-pixel
 * tick at the Bloodied line. Both show only for him. A refused press blinks the HP bar for every hero.
 */
const bar = byId("hpBar");
const debt = byId("hpDebt");
const shards = byId("hpShards");
const tick = byId("hpTick");
let last = "";
/** the forfeit last seen still running; a new one replays the shards */
let breaking = false;

/** restart the shards' fall */
function replayShards(): void {
  shards.hidden = true;
  void shards.offsetWidth;
  shards.hidden = false;
}

export function updateDebtBar(): void {
  bar.classList.toggle("empty", hero.denied.hp > 0);
  const shown = character.kit === "brannoc";
  if (tick.hidden === shown) tick.hidden = !shown;
  if (!shown) {
    if (!debt.hidden) debt.hidden = true;
    if (!shards.hidden) shards.hidden = true;
    return;
  }
  const max = Math.max(1, progress.stats.hp);
  const from = (hero.hp / max) * 100;
  const share = (brannoc.debt / max) * 100;
  const fading = brannoc.debt > 0 && brannoc.debtIdle >= DEBT.idle && brannoc.berserkT <= 0;
  const key = [from.toFixed(1), share.toFixed(1), brannoc.repayFlash > 0, fading, bloodiedLine()].join();
  if (key !== last) {
    last = key;
    debt.hidden = share <= 0;
    debt.style.setProperty("--from", `${from}%`);
    debt.style.setProperty("--share", `${share}%`);
    debt.classList.toggle("repay", brannoc.repayFlash > 0);
    debt.classList.toggle("fading", fading);
    tick.style.setProperty("--at", `${bloodiedLine() * 100}%`);
  }
  const forfeiting = brannoc.forfeitT > 0;
  if (forfeiting && !breaking) {
    shards.style.setProperty("--from", `${brannoc.forfeitFrom * 100}%`);
    shards.style.setProperty("--share", `${brannoc.forfeitWidth * 100}%`);
    replayShards();
  }
  if (!forfeiting && !shards.hidden) shards.hidden = true;
  breaking = forfeiting;
}
