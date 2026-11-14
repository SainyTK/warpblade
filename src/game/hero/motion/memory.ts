import { STAND } from "../../../constants/hero";
import type { MotionMemory } from "../../../types/motion";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): MotionMemory => ({
  clip: "idle",
  face: 1,
  st: 0,
  last: null,
  from: null,
  since: 0,
  frames: 0,
  step: false,
  jumpT: 0,
  jumpV0: 1,
  t: 0,
  ground: true,
  airVy: 0,
  landAt: Number.NEGATIVE_INFINITY,
  landDepth: 0,
});

/** the one owner of what the motion layer remembers */
export const motion: MotionMemory = fresh();
// each co-op player's hero keeps its own motion layer; only the host poses heroes
rememberPerSeat(objectMemory(motion, true));

/** a fresh run: standing, nothing to cross from */
export function resetMotion(): void {
  Object.assign(motion, fresh(), { last: STAND });
}
