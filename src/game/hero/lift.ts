import { HERO_MOVE as M } from "../../constants/combat";
import { riseSpeed } from "../../utils/math";
import { hero } from "../state";

/**
 * The one way anything lifts Kael: jumps, and moves that rise on their own.
 * A jump, or a move started on the floor, rises its full height and sets the highest point of this time in the air.
 * A move started in the air rises its own height at most, and never past that point.
 * Lifts never stack: while Kael already rises faster, he keeps that rise and the new lift adds nothing.
 * Letting go of Up cuts short only a jump's rise.
 */
export function lift(rise: number, isJump: boolean): void {
  const h = hero;
  const fromFloor = isJump || h.ground;
  const height = fromFloor ? rise : Math.min(rise, h.y - h.liftTop);
  if (height <= 0) return;
  const vy = -riseSpeed(height, M.gravity);
  if (h.vy <= vy) return;
  h.vy = vy;
  h.ground = false;
  h.cutShort = !isJump;
  if (fromFloor) h.liftTop = h.y - rise;
}
