import { BACK_REACH } from "../../../constants/tallis/knives";
import type { Enemy } from "../../../types/enemy";
import { kindOf } from "../../enemies/kinds";
import { hero } from "../../state";

/** he stands on the side of this foe it does not face */
export const behindOf = (e: Enemy, x = hero.x): boolean => {
  const side = Math.sign(x - e.x);
  return side !== 0 && side !== e.face;
};

/** a ground foe level with him, standing */
const onFloorWithHim = (e: Enemy): boolean =>
  e.hp > 0 && !e.air && !kindOf(e.type).flies && Math.abs(e.y - hero.y) < 20;

/** a foe stands ahead of him, the way he faces, or right against him */
const ahead = (e: Enemy): boolean => (e.x - hero.x) * hero.face >= -4;

/**
 * The nearest ground foe within reach ahead of him, if its back is to him: his next blow lands from behind, and the rose
 * chevron sits on its back. Null when the nearest foe in reach faces him or there is none.
 */
export function backOpenFoe(foes: readonly Enemy[]): Enemy | null {
  let best: Enemy | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const e of foes) {
    if (!onFloorWithHim(e) || !ahead(e)) continue;
    const d = Math.abs(e.x - hero.x);
    if (d > BACK_REACH || d >= bestD) continue;
    best = e;
    bestD = d;
  }
  return best && behindOf(best) ? best : null;
}
