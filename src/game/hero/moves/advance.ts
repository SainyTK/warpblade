import { ADVANCE } from "../../../constants/combo";
import type { MoveDef, Stride } from "../../../types/move";
import { isHeld } from "../../input";
import { hero } from "../../state";
import { nearestGapAhead } from "../situation";

/** the stride of a move at this time, if any */
export function strideAt(m: MoveDef, time: number): Stride | undefined {
  return m.strides?.find((s) => time >= s.from && time < s.to);
}

/** step forward on this stride, further while forward is held, and stop at arm's length from the foe in front */
export function advance(stride: Stride): void {
  const forward = isHeld(hero.face > 0 ? "right" : "left");
  const blocked = nearestGapAhead() < ADVANCE.contact;
  hero.vx = blocked ? 0 : hero.face * stride.speed * (forward ? ADVANCE.lean : 1);
}
