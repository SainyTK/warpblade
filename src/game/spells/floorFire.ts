import { FIRE_RAMP } from "../../constants/palette";
import { glow, hairline, place } from "../../engine/frame";
import type { SourceId } from "../../types/build";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { grain } from "../../utils/grain";
import { clamp, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { ignite } from "../enemies/burn";
import { enemyBox } from "../enemies/enemy";
import { game, particles, rng } from "../state";
import { boxHit } from "../world";

/** seconds between the floor's burns, and how long a foe standing in it keeps burning */
const FIRE = { tick: 0.4, burn: 1 } as const;

/** the tongues of flame: the gap between them and how high the tallest stands, in art pixels */
const TONGUES = { gap: 2.5, height: 6 } as const;

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
      const count = Math.floor((w * 2) / TONGUES.gap);
      // a bed of embers along the floor, then tongues of flame standing in it, each swaying on its own beat
      hairline(
        cx - w,
        cy - 0.25,
        cx + w,
        cy - 0.25,
        (u) => FIRE_RAMP[flicker(Math.floor(u * w), Math.floor(t * 10)) > 0.5 ? 3 : 5],
        k,
      );
      hairline(cx - w + 1, cy + 0.25, cx + w - 1, cy + 0.25, FIRE_RAMP[6], k * 0.8);
      for (let i = 0; i <= count; i++) {
        const tx = cx - w + i * TONGUES.gap + (grain(i, cx) - 0.5) * TONGUES.gap;
        const edge = 1 - Math.abs((i / count) * 2 - 1) ** 3;
        const beat = t * (7 + 5 * grain(cx, i)) + grain(i, 7) * TAU;
        const h = TONGUES.height * edge * k * (0.45 + 0.55 * Math.abs(Math.sin(beat)));
        if (h < 0.8) continue;
        const sway = Math.sin(beat * 1.7) * 1.2;
        hairline(tx - 0.5, cy, tx - 0.5 + sway * 0.5, cy - h * 0.6, FIRE_RAMP[5], k);
        hairline(tx + 0.5, cy, tx + 0.5 + sway * 0.5, cy - h * 0.7, FIRE_RAMP[4], k);
        hairline(tx, cy, tx + sway, cy - h, (u) => FIRE_RAMP[u < 0.3 ? 1 : u < 0.65 ? 3 : 5], k);
      }
      glow(cx, cy - 2, w * 0.8, FIRE_RAMP[4], 0.3 * k);
    },
    draw() {},
  };
}
