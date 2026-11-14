import { glowLine, hairline, line, place, sparkle } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { ROSE_RAMP, ROSE_SPARKS } from "../../look/rose";

/** the glass rapier appears this far to the side of its foe, crosses in this long, and holds this long after */
const LOOK = { from: 30, cross: 0.14, hold: 0.12, length: 20 } as const;

/** what the rapier does as it strikes, past its damage: a mark, a Point */
export type GlassHit = (e: Enemy) => void;

/**
 * A rapier of rose glass that appears on `side` of its foe after `delay` and lunges through it, dealing `damage` once
 * as its point crosses the foe's middle, following the foe while it stands. It counts for the source it is given.
 */
export function createGlassRapier(
  foe: Enemy,
  side: number,
  delay: number,
  damage: number,
  source: string,
  hit?: GlassHit,
): Effect {
  const o = { t: -delay, struck: false, x: 0, y: 0, shown: false };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      const [ex, ey] = enemyCenter(foe);
      if (foe.hp > 0) [o.x, o.y, o.shown] = [ex, ey, true];
      if (!o.struck && o.t >= LOOK.cross * 0.6) {
        o.struck = true;
        if (foe.hp > 0) {
          dealDamage(foe, damage, { fromX: ex + side * 10, kx: -side * 40, stagger: 0.3, source });
          game.fx.push(createImpact(ex, ey, -side, true, ROSE_SPARKS));
          hit?.(foe);
        }
      }
      return o.t < LOOK.cross + LOOK.hold;
    },
    draw() {
      if (o.t < 0 || !o.shown) return;
      place();
      const u = Math.min(1, o.t / LOOK.cross);
      const k = o.t > LOOK.cross ? 1 - (o.t - LOOK.cross) / LOOK.hold : 1;
      const tip = o.x + side * LOOK.from - side * (LOOK.from * 2) * u;
      const hilt = tip + side * LOOK.length;
      line(hilt, o.y, tip, o.y, ROSE_RAMP[4], 0.75 * k);
      hairline(hilt - side * 3, o.y, tip, o.y, ROSE_RAMP[6], k);
      line(hilt, o.y - 2, hilt, o.y + 2, ROSE_RAMP[5], 0.8 * k);
      glowLine(hilt, o.y, tip, o.y, 4, ROSE_RAMP[3], 0.35 * k);
      sparkle(tip, o.y, 2, ROSE_RAMP[5], ROSE_RAMP[6], 0.6 * k);
    },
  };
}
