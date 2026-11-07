import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { ASHEN_WAKE as A } from "../../../constants/ysra/rites";
import { glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyBox } from "../../enemies/enemy";
import { game, particles, progress, rng } from "../../state";
import { boxHit } from "../../world";

/** patches burning now, for the cap */
let burning = 0;

/** which cinder of a strip glows this beat: a cheap stable flicker */
const flicker = (i: number, beat: number): number => Math.abs(Math.sin(i * 12.9898 + beat * 78.233) * 43758.5453) % 1;

function createCinder(x: number, y: number): Effect {
  let t = 0;
  let tick = 0;
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0) {
        tick = A.tick;
        for (const e of game.enemies)
          if (e.hp > 0 && boxHit(enemyBox(e), [x - A.halfWidth, y - 12, x + A.halfWidth, y])) {
            dealDamage(e, progress.stats.ap * A.power, { dot: true, source: "abilities" });
            ignite(e, A.burn);
          }
      }
      if (rng.chance(0.08))
        particles.spawn(PK.EMBER, x + rng.range(-A.halfWidth, A.halfWidth), y - 1, 0, -rng.range(15, 35), 0.6, {
          sparks: RITE_SPARKS,
        });
      const done = t >= A.life;
      if (done) burning--;
      return !done;
    },
    drawBack() {
      place();
      const k = clamp((A.life - t) / (A.life * 0.4));
      const beat = Math.floor(t * 10);
      for (let dx = -A.halfWidth; dx <= A.halfWidth; dx++) {
        const f = flicker(x + dx, beat);
        px(x + dx, y, RITE_RAMP[f > 0.6 ? 4 : f > 0.25 ? 3 : 2], k);
        if (f > 0.7) px(x + dx, y - 1, RITE_RAMP[f > 0.9 ? 5 : 4], k);
        if (f > 0.9) px(x + dx, y - 2, RITE_RAMP[4], k);
      }
      glow(x, y - 2, 10, RITE_RAMP[4], 0.3 * k);
    },
    draw() {},
  };
}

/** a patch of burning ground, unless the cap is reached */
export function layCinder(x: number, y: number): void {
  if (burning >= A.cap) return;
  burning++;
  game.fx.push(createCinder(Math.round(x), Math.round(y)));
}

/** a fresh run: the effects were cleared with the rest of the field */
export function clearCinders(): void {
  burning = 0;
}
