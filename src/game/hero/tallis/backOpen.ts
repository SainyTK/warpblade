import { BACK_REACH, SPRING } from "../../../constants/tallis/knives";
import type { Enemy } from "../../../types/enemy";
import { enemyCenter } from "../../enemies/enemy";
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

/** a flier hovering over him within the spring's reach, while no ground foe stands in reach of his knives */
export function flierOverhead(foes: readonly Enemy[]): boolean {
  const ground = foes.some((e) => onFloorWithHim(e) && Math.abs(e.x - hero.x) <= BACK_REACH);
  if (ground) return false;
  return foes.some((e) => {
    if (e.hp <= 0 || (!kindOf(e.type).flies && !e.air)) return false;
    const above = hero.y - enemyCenter(e)[1];
    return Math.abs(e.x - hero.x) <= SPRING.across && above >= SPRING.above[0] && above <= SPRING.above[1];
  });
}

/** a foe stands ahead of him, the way he faces, or right against him */
const ahead = (e: Enemy): boolean => (e.x - hero.x) * hero.face >= -4;

/**
 * The nearest ground foe within reach ahead of him, if its back is to him: J plays the behind string on it, and the rose
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
