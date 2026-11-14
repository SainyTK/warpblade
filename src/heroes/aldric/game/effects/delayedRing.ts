import type { HitOptions } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { game } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { DAWN_RAMP } from "../../constants/light";
import { foesIn, strikeEach } from "../strike";

/**
 * A ring of light that runs out along the floor from (x, y) after `delay`: a floor ring and dust, and every foe within
 * `r` of x and on the floor's height band struck once for `damage`.
 */
export function createDelayedRing(
  x: number,
  y: number,
  r: number,
  delay: number,
  damage: number,
  o: HitOptions,
): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < delay) return true;
      game.fx.push(createFloorRing(x, y, r, DAWN_RAMP, 0.4));
      dust(x, y, 4);
      strikeEach(foesIn([x - r, y - 30, x + r, y + 4], x), damage, { ...o, fromX: x });
      return false;
    },
    draw() {},
  };
}
