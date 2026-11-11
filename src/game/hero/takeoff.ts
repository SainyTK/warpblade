import { JUMP_LOAD } from "../../constants/takeoff";
import type { HeroState } from "../../types/hero";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { hero } from "../state";

/** the floor states a jump loads out of */
const LOADS_FROM: ReadonlySet<HeroState> = new Set(["idle", "walk", "run"]);

/** the jump being loaded: game seconds still to go, whether it began standing, and what leaves the floor */
const load: { left: number; still: boolean; leap: (() => void) | null } = { left: 0, still: false, leap: null };
// each co-op player's hero loads its own jump
rememberPerSeat(objectMemory(load, true));

/**
 * Up from the floor: out of a stand or a stride the knees load for `JUMP_LOAD`, then `leap` runs; out of anything
 * else, or when `now` is set (a blow's follow-through), `leap` runs at once. A press while a load runs is used up.
 */
export function takeOff(leap: () => void, now = false): void {
  if (load.leap) return;
  if (now || !hero.ground || !LOADS_FROM.has(hero.state)) {
    leap();
    return;
  }
  Object.assign(load, { left: JUMP_LOAD, still: hero.state === "idle", leap });
}

/** a jump is loading: the hero stays on the floor and nothing else starts until it leaves */
export const loading = (): boolean => load.leap !== null;

/** game seconds into the load under way, or -1 when there is none */
export const loadTime = (): number => (load.leap ? JUMP_LOAD - load.left : -1);

/** the load under way began from a stand, so a hero's own crouch may show */
export const loadStill = (): boolean => load.still;

/** drop any load: a fresh run */
export function clearTakeoff(): void {
  Object.assign(load, { left: 0, still: false, leap: null });
}

/** the load runs out into the leap; a hit, a fall off a ledge or any action of the hero's own ends it */
export function tickTakeoff(dt: number): void {
  const leap = load.leap;
  if (!leap) return;
  if (!hero.ground || !LOADS_FROM.has(hero.state)) {
    clearTakeoff();
    return;
  }
  load.left -= dt;
  if (load.left > 0) return;
  clearTakeoff();
  leap();
}
