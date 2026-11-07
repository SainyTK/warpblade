import { FIRE_RAMP } from "../../constants/palette";
import { glow, place, px } from "../../engine/frame";
import type { SourceId } from "../../types/build";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { ignite } from "../enemies/burn";
import { enemyBox } from "../enemies/enemy";
import { game, particles, rng } from "../state";
import { boxHit } from "../world";

/** seconds between the floor's burns, and how long a foe standing in it keeps burning */
const FIRE = { tick: 0.4, burn: 1 } as const;

/** which pixel of the strip glows this beat: a cheap stable flicker */
const flicker = (i: number, beat: number): number => Math.abs(Math.sin(i * 12.9898 + beat * 78.233) * 43758.5453) % 1;

/** a strip of burning floor `halfWidth` either side of x: foes standing in it take `damage` each tick and catch fire */
export function createFloorFire(
  x: number,
  y: number,
  halfWidth: number,
  life: number,
  damage: number,
  source: SourceId,
): Effect {
  const cx = Math.round(x);
  const cy = Math.round(y);
  const w = Math.round(halfWidth);
  let t = 0;
  let tick = 0;
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0) {
        tick = FIRE.tick;
        for (const e of game.enemies)
          if (e.hp > 0 && boxHit(enemyBox(e), [cx - w, cy - 12, cx + w, cy])) {
            dealDamage(e, damage, { dot: true, source });
            ignite(e, FIRE.burn);
          }
      }
      if (rng.chance(0.15)) particles.spawn(PK.EMBER, cx + rng.range(-w, w), cy - 1, 0, -rng.range(15, 35), 0.6, {});
      return t < life;
    },
    drawBack() {
      place();
      const k = clamp((life - t) / (life * 0.4));
      const beat = Math.floor(t * 10);
      for (let dx = -w; dx <= w; dx++) {
        const f = flicker(cx + dx, beat);
        px(cx + dx, cy, FIRE_RAMP[f > 0.6 ? 3 : f > 0.25 ? 4 : 5], k);
        if (f > 0.7) px(cx + dx, cy - 1, FIRE_RAMP[f > 0.9 ? 2 : 3], k);
        if (f > 0.9) px(cx + dx, cy - 2, FIRE_RAMP[3], k);
      }
      glow(cx, cy - 2, w * 0.8, FIRE_RAMP[4], 0.3 * k);
    },
    draw() {},
  };
}
