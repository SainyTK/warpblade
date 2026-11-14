import { hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { game, lights } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { CRESCENT } from "../../constants/spells";
import { STORE_ANGLE } from "../moves/slashes";
import { storeCut } from "../store";

/** one flying crescent: where it starts, which way, how far, how tall, what it deals, stores and does to foes */
export interface CrescentSpec {
  x: number;
  y: number;
  dir: number;
  range: number;
  tall: number;
  now: number;
  store: number;
  slow: number;
  launch: number;
  burst: number;
}

/**
 * Crescent Wave: a tall ink crescent, bowed ahead, that flies level through every foe on its line, cutting each once
 * (a share at once, the rest stored) and bursting at the end of its flight with its seventh level.
 */
export function createCrescent(o: CrescentSpec): Effect {
  const struck = new Set<Enemy>();
  const life = o.range / CRESCENT.speed;
  const half = CRESCENT.half * o.tall;
  let t = 0;
  let burst = false;
  const front = (): number => o.x + o.dir * CRESCENT.speed * t;
  const cut = (e: Enemy, power: number, fromX: number): void => {
    game.fx.push(createImpact(...enemyCenter(e), o.dir, false));
    dealDamage(e, power, { fromX, kx: o.dir * 30, launch: o.launch || undefined, source: "abilities" });
    if (o.slow) e.chill = Math.max(e.chill, o.slow);
  };
  return {
    update(dt) {
      t += dt;
      const fx = front();
      const box: [number, number, number, number] = [
        Math.min(fx, fx - o.dir * 8),
        o.y - half,
        Math.max(fx, fx - o.dir * 8),
        o.y + half,
      ];
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        cut(e, o.now, fx - o.dir * 20);
        storeCut(e, o.store, STORE_ANGLE.rise, "abilities");
      }
      if (t >= life && o.burst && !burst) {
        burst = true;
        lights.add(fx, o.y, 30, skin.ramp[4], 0.5, 0.2);
        for (const e of game.enemies) {
          const [ex, ey] = enemyCenter(e);
          if (e.hp > 0 && Math.hypot(ex - fx, ey - o.y) < CRESCENT.burstReach) cut(e, o.burst, fx);
        }
      }
      return t < life;
    },
    draw() {
      place();
      const u = clamp(t / life);
      const fx = front();
      const ramp = skin.ramp;
      for (let k = -half; k <= half; k += 0.5) {
        const v = k / half;
        const bow = (1 - v * v) * CRESCENT.bow;
        const w = (1 - Math.abs(v)) * 3 * (1 - u * 0.4);
        line(fx + o.dir * (bow - w), o.y + k, fx + o.dir * bow, o.y + k, ramp[Math.abs(v) > 0.7 ? 2 : 1], 1 - u * 0.4);
        if (Math.abs(v) < 0.95)
          hairline(fx + o.dir * (bow + 0.5), o.y + k, fx + o.dir * (bow + 0.5), o.y + k + 0.5, WHITE, 1 - u);
      }
    },
  };
}
