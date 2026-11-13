import { PAL } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, progress } from "../../state";
import { drawLinks } from "./chainLinks";

const LIFE = 2.5;

/**
 * Undertow's chain line, left on the floor along a Chain Bind's yank: each foe that walks across it trips once, stunned
 * and cut. It is the skill's own hit, so it carries the skill's id.
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
        dealDamage(e, progress.stats.ad * power, { fromX: e.x - e.face * 4, stun, ky: -30, source: "o_undertow" });
        e.stun = Math.max(e.stun, stun);
      }
      return t < LIFE;
    },
    drawBack() {
      place();
      const fade = Math.min(1, (LIFE - t) / 0.4);
      drawLinks(lo, y - 1, hi, y - 1, PAL.brass[4], fade);
    },
    draw() {},
  };
}
