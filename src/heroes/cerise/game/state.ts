import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { CeriseState } from "../types/state";

const fresh = (): CeriseState => ({
  points: 0,
  pointFlash: 0,
  abilityCd: { flurry: 0, line: 0, bloom: 0, needle: 0, mirror: 0 },
  abilityFull: { flurry: 1, line: 1, bloom: 1, needle: 1, mirror: 1 },
  castAbility: "flurry",
  castWide: false,
  castPower: 1,
  castSpent: 0,
  flurryDone: 0,
  flurryCount: 0,
  links: 0,
  ripBeat: 0,
  ripNext: false,
  ripSpoiled: false,
  tempestLevel: 1,
  tempestThrusts: 0,
  tempestLunged: false,
  lungePoints: 0,
  keenStreak: 0,
  keenCount: 0,
  stance: 0,
});

/** the one owner of what Cerise's kit remembers: Points, ability waits, the riposte chain and the ultimate under way */
export const cerise: CeriseState = fresh();
rememberPerSeat(objectMemory(cerise));

/** a fresh run */
export function resetCeriseState(): void {
  Object.assign(cerise, fresh());
}

/** the timers run down */
export function tickCeriseState(dt: number): void {
  cerise.pointFlash = Math.max(0, cerise.pointFlash - dt);
  cerise.ripBeat = Math.max(0, cerise.ripBeat - dt);
  cerise.stance = Math.max(0, cerise.stance - dt);
}
