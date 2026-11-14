import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { ZafirState } from "../types/states";

const fresh = (): ZafirState => ({
  whirl: 0,
  whirlIdle: 0,
  ringClock: 0,
  ringCutting: false,
  stride: 0,
  abilityCd: { spout: 0, crescent: 0, gale: 0, glass: 0, quicksand: 0 },
  abilityFull: { spout: 1, crescent: 1, gale: 1, glass: 1, quicksand: 1 },
  casting: "spout",
  castWide: false,
  castInString: false,
  bladeOut: false,
  storm: 0,
  stormLevel: 1,
  sides: 0,
  keenStreak: 0,
  runRingCuts: 0,
});

/** the one owner of what Zafir's kit remembers; each co-op seat keeps its own */
export const zafir: ZafirState = fresh();
rememberPerSeat(objectMemory(zafir));

/** a fresh run */
export function resetZafirState(): void {
  Object.assign(zafir, fresh());
}
