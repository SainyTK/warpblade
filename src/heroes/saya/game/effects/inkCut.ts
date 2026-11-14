import { hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { HeroSource } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { storeCut } from "../store";

/** an ink cut sent ahead: where it starts, its direction, how far it runs and how fast, what it deals and stores */
export interface InkCutSpec {
  x: number;
  y: number;
  dir: number;
  range: number;
  speed: number;
  now: number;
  store: number;
  /** half its height, so a taller one reaches foes above and below */
  half: number;
  source: HeroSource;
}

/**
 * A thin ink cut that runs level ahead from where it was sent: a dark stroke with a white edge that thins as it goes,
 * cutting each foe it passes once, a little at once and the rest stored for her next sheathe.
 */
export function createInkCut(o: InkCutSpec): Effect {
  const struck = new Set<Enemy>();
  const life = o.range / o.speed;
  let t = 0;
  const front = (): number => o.x + o.dir * o.speed * t;
  return {
    update(dt) {
      t += dt;
      const fx = front();
      const box: [number, number, number, number] = [
        Math.min(fx, fx - o.dir * 12),
        o.y - o.half,
        Math.max(fx, fx - o.dir * 12),
        o.y + o.half,
      ];
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        game.fx.push(createImpact(...enemyCenter(e), o.dir, false));
        if (o.now > 0) dealDamage(e, o.now, { fromX: fx - o.dir * 20, kx: o.dir * 20, source: o.source });
        storeCut(e, o.store, 0, o.source);
      }
      return t < life;
    },
    draw() {
      place();
      const u = clamp(t / life);
      const fx = front();
      const tail = Math.min(18, o.speed * t);
      const ramp = skin.ramp;
      const h = Math.max(0.5, o.half * 0.25 * (1 - u * 0.5));
      for (let w = -h; w <= h; w += 0.5)
        line(fx - o.dir * tail, o.y + w, fx, o.y + w * 0.4, ramp[Math.abs(w) > h * 0.6 ? 2 : 1], 1 - u * 0.5);
      hairline(fx - o.dir * tail, o.y - h - 0.5, fx, o.y - 0.5, WHITE, 1 - u);
    },
  };
}
