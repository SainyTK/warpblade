import { PAL } from "../../../constants/palette";
import { line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, progress } from "../../state";

const LIFE = 2.5;

/**
 * Undertow's chain line, left on the floor along a Backline: each foe that walks across it trips once, stunned and cut.
 * It rides his Backline, so it counts for his attacks.
 */
export function createTripLine(x0: number, x1: number, y: number, stun: number, power: number): Effect {
  const struck = new Set<Enemy>();
  const lo = Math.min(x0, x1);
  const hi = Math.max(x0, x1);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || e.air || struck.has(e)) continue;
        const [bx0, , bx1, by1] = enemyBox(e);
        if (bx1 < lo || bx0 > hi || Math.abs(by1 - y) > 3) continue;
        struck.add(e);
        dealDamage(e, progress.stats.ad * power, { fromX: e.x - e.face * 4, stun, ky: -30 });
        e.stun = Math.max(e.stun, stun);
      }
      return t < LIFE;
    },
    drawBack() {
      place();
      const fade = Math.min(1, (LIFE - t) / 0.4);
      line(lo, y - 1, hi, y - 1, PAL.brass[1], 0.8 * fade);
      for (let x = lo; x <= hi; x += 3) px(x, y - 1, PAL.brass[3], fade);
    },
    draw() {},
  };
}
