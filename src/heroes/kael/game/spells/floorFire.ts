import { FIRE_RAMP } from "../../../../constants/palette";
import { place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { ignite } from "../../../../game/enemies/burn";
import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { drawFireBed, type FireColors } from "./fireBed";

/** seconds between the floor's burns, how long a foe standing in it keeps burning, and how high above the floor it burns */
const FIRE = { tick: 0.4, burn: 1, reach: 12 } as const;

/** the burning floor's colors */
const FLOOR_FIRE: FireColors = {
  hot: FIRE_RAMP[1],
  bright: FIRE_RAMP[3],
  body: FIRE_RAMP[4],
  edge: FIRE_RAMP[5],
  deep: FIRE_RAMP[6],
};

/** a strip of burning floor `halfWidth` either side of x: foes standing in it take `damage` each tick and catch fire.
 *  Given a `wall` height, its flames stand that tall and burn foes up to their tops. */
export function createFloorFire(
  x: number,
  y: number,
  halfWidth: number,
  life: number,
  damage: number,
  source: SourceId,
  wall?: number,
): Effect {
  const cx = Math.round(x);
  const cy = Math.round(y);
  const w = Math.round(halfWidth);
  const top = Math.max(FIRE.reach, (wall ?? 0) * 1.5);
  let t = 0;
  let tick = 0;
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0) {
        tick = FIRE.tick;
        for (const e of game.enemies)
          if (e.hp > 0 && boxHit(enemyBox(e), [cx - w, cy - top, cx + w, cy])) {
            dealDamage(e, damage, { dot: true, source });
            ignite(e, FIRE.burn);
          }
      }
      if (fxRng.chance(wall ? 0.5 : 0.15))
        particles.spawn(PK.EMBER, cx + fxRng.range(-w, w), cy - 1, 0, -fxRng.range(15, wall ? 70 : 35), 0.6, {});
      return t < life;
    },
    drawBack() {
      place();
      drawFireBed(cx, cy, w, t, clamp((life - t) / (life * 0.4)), FLOOR_FIRE, wall);
    },
    draw() {},
  };
}
