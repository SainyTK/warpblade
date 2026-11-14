import { GROUND } from "../../../../constants/stage";
import { fleck, glowLine, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { ROSE_RAMP, ROSE_SPARKS } from "../../look/rose";

/** a needle falls from this far above the floor at this speed, and stands in the floor this long after */
const FALL = { from: 70, speed: 520, stand: 0.25 } as const;

/** what a needle does to a foe it strikes, after the damage */
export type NeedleHit = (e: Enemy) => void;

/**
 * One needle of light that falls after `delay` onto the floor at x, striking every foe in its path once for `damage`,
 * then stands a moment in the floor and fades.
 */
export function createNeedle(x: number, y: number, delay: number, damage: number, hit: NeedleHit): Effect {
  const floor = Math.min(GROUND, surfaceBelow(x, y - 4));
  const o = { t: -delay, tip: floor - FALL.from, landed: 0 };
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      if (o.tip < floor) {
        const from = o.tip;
        o.tip = Math.min(floor, o.tip + FALL.speed * dt);
        for (const e of game.enemies) {
          if (e.hp <= 0 || struck.has(e) || !boxHit([x - 2, from - 6, x + 2, o.tip], enemyBox(e))) continue;
          struck.add(e);
          dealDamage(e, damage, { fromX: x, kx: 0, stagger: 0.25, source: "abilities" });
          game.fx.push(createImpact(x, o.tip, 1, false, ROSE_SPARKS));
          hit(e);
        }
        return true;
      }
      o.landed += dt;
      return o.landed < FALL.stand;
    },
    draw() {
      if (o.t < 0) return;
      place();
      const k = o.landed ? 1 - o.landed / FALL.stand : 1;
      const top = o.tip - 12;
      line(x, top, x, o.tip, ROSE_RAMP[4], k);
      hairline(x, top + 3, x, o.tip, ROSE_RAMP[6], k);
      glowLine(x, top, x, o.tip, 3, ROSE_RAMP[3], 0.35 * k);
      fleck(x, o.tip, ROSE_RAMP[6], k);
    },
  };
}
