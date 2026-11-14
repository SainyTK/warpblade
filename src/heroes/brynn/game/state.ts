import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { BrynnState } from "../types/state";

const fresh = (): BrynnState => ({
  heft: 0,
  sinceHit: 0,
  cd: { rend: 0, quake: 0 },
  cdFull: { rend: 1, quake: 1 },
  casting: "rend",
  wide: false,
  power: 1,
  carry: 0,
  fissure: false,
});

/** the one owner of what Brynn's kit remembers: Heft, ability recharges, the cast under way, the carried string */
export const brynn: BrynnState = fresh();
rememberPerSeat(objectMemory(brynn));

/** a fresh run */
export function resetBrynnState(): void {
  Object.assign(brynn, fresh());
}
