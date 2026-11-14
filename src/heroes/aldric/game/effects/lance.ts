import { W } from "../../../../constants/stage";
import { glow, hairline, line, place } from "../../../../engine/frame";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP } from "../../constants/light";

/** a lance's flight speed, length, half thickness and life */
const LANCE = { speed: 330, length: 16, half: 3, life: 0.7 } as const;

/** what a lance does to each foe it meets; it flies on through up to `pierce` foes, climbing `rise` px per px */
export interface LanceSpec {
  pierce: number;
  rise: number;
  /** a lance's size, 1 plain */
  size: number;
  hit(e: Enemy, x: number, y: number): void;
  /** where it ends, spent or out of flight */
  end?(x: number, y: number): void;
}

/** a spear of dawn light thrown straight ahead: a white core, gold body and a thinning tail */
export function createDawnLance(
  x: number,
  y: number,
  face: number,
  spec: LanceSpec,
  struck = new Set<Enemy>(),
): Effect {
  const o = { x, y, t: 0, left: spec.pierce };
  const len = LANCE.length * spec.size;
  const half = LANCE.half * spec.size;
  return {
    update(dt) {
      o.t += dt;
      o.x += face * LANCE.speed * dt;
      o.y += spec.rise * LANCE.speed * dt;
      for (const e of game.enemies) {
        if (o.left <= 0 || struck.has(e) || e.hp <= 0) continue;
        if (!boxHit([o.x - 4, o.y - half, o.x + 4, o.y + half], enemyBox(e))) continue;
        struck.add(e);
        o.left--;
        spec.hit(e, o.x, o.y);
      }
      const alive = o.left > 0 && o.t < LANCE.life && o.x > -10 && o.x < W + 10;
      if (!alive) spec.end?.(o.x, o.y);
      return alive;
    },
    draw() {
      place();
      const k = 1 - o.t / LANCE.life;
      const tail = o.x - face * len;
      const dy = -spec.rise * len;
      for (let w = -half * 0.5; w <= half * 0.5; w += 0.5)
        line(tail, o.y + dy + w, o.x - face * Math.abs(w) * 2, o.y + w, DAWN_RAMP[w === 0 ? 5 : 4], 0.9);
      line(o.x - face * 3, o.y - half * 0.6, o.x + face * 2, o.y, DAWN_RAMP[5]);
      line(o.x - face * 3, o.y + half * 0.6, o.x + face * 2, o.y, DAWN_RAMP[5]);
      hairline(tail, o.y + dy - 0.5, o.x, o.y - 0.5, DAWN_RAMP[5]);
      hairline(o.x - face * len * 0.6, o.y + dy * 0.6, o.x + face * 2, o.y, WHITE);
      hairline(tail - face * 10, o.y + dy * 1.6, tail, o.y + dy, DAWN_RAMP[3], (u) => 0.6 * u);
      glow(o.x, o.y, 8 * spec.size, DAWN_RAMP[4], 0.45 * (0.5 + 0.5 * k));
    },
  };
}
