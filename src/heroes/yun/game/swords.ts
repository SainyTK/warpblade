import { game } from "../../../game/state";
import { SPIRIT } from "../constants/swords";
import { yun } from "./state";

/** spirit swords come back while he holds fewer than his resting count, and the timers of swords away run down */
export function tickSwords(dt: number): void {
  for (let i = 0; i < yun.away.length; i++) yun.away[i] = Math.max(0, yun.away[i] - dt);
  if (yun.swords >= SPIRIT.rest) {
    yun.regen = SPIRIT.regen;
    return;
  }
  yun.regen -= dt;
  if (yun.regen > 0) return;
  yun.regen = SPIRIT.regen;
  yun.swords++;
}

/** spirit swords join him, up to the most he can hold */
export function gainSwords(n: number): void {
  yun.swords = Math.min(SPIRIT.most, yun.swords + n);
}

/** every held sword leaves: returns how many went */
export function spendSwords(): number {
  const n = yun.swords;
  yun.swords = 0;
  yun.regen = SPIRIT.regen;
  return n;
}

/** a held sword thrusts out for this many seconds, so its place in the fan stands empty meanwhile */
export function sendAway(slot: number, seconds: number): void {
  yun.away[slot] = Math.max(yun.away[slot], seconds);
}

/** a phase for the swords' float, the same for every sword so the fan bobs together */
export const floatPhase = (): number => game.t;
