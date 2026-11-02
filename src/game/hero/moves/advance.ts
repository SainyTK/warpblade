import { ADVANCE } from "../../../constants/combo";
import type { MoveDef } from "../../../types/move";
import { isHeld } from "../../input";
import { hero } from "../../state";
import { nearestGapAhead } from "../situation";

/** the stride speed of a move at this time, or 0 outside its strides */
export function strideAt(m: MoveDef, time: number): number {
  return m.strides?.find((s) => time >= s.from && time < s.to)?.speed ?? 0;
}

/** step forward at this speed, further while forward is held, and stop at arm's length from the foe in front */
export function advance(speed: number): void {
  const forward = isHeld(hero.face > 0 ? "right" : "left");
  hero.vx = nearestGapAhead() < ADVANCE.contact ? 0 : hero.face * speed * (forward ? ADVANCE.lean : 1);
}
