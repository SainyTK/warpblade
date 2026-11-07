import { BELLOW } from "../../constants/hulda/bellow";
import { ellipseRing, glow, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { clamp, ease } from "../../utils/math";
import { kindOf } from "../enemies/kinds";

/**
 * Bellow: three rings run out from her mouth to the roar's reach, and every foe it caught is dragged toward her over a
 * quarter of a second, walkers sliding along the floor and flying minions drifting down to her hands.
 */
export function createBellowRing(
  x: number,
  y: number,
  caught: readonly Enemy[],
  [toX, toY]: readonly [number, number],
  ramp: Ramp,
): Effect {
  const pulls = caught.map((e) => ({
    e,
    dx: Math.sign(toX - e.x) * Math.max(0, Math.min(BELLOW.pull, Math.abs(toX - e.x) - 8)),
    dy: kindOf(e.type).flies && e.rank === "minion" ? clamp(toY + BELLOW.dropTo - e.y, -BELLOW.drop, BELLOW.drop) : 0,
  }));
  const life = BELLOW.ringTime + BELLOW.ringGap * 2;
  let t = 0;
  return {
    update(dt) {
      const step = Math.min(dt, Math.max(0, BELLOW.pullTime - t)) / BELLOW.pullTime;
      for (const p of pulls) {
        if (p.e.hp <= 0) continue;
        p.e.x += p.dx * step;
        p.e.y += p.dy * step;
      }
      t += dt;
      return t < life;
    },
    draw() {
      place();
      for (let i = 0; i < 3; i++) {
        const u = (t - i * BELLOW.ringGap) / BELLOW.ringTime;
        if (u <= 0 || u >= 1) continue;
        const r = BELLOW.reach * ease.outQuad(u);
        const k = 1 - u;
        ellipseRing(x, y, r, r * 0.7, ramp[Math.min(6, 3 + Math.round(k * 2))], k);
        ellipseRing(x, y, r - 1, (r - 1) * 0.7, ramp[2], k * 0.5);
      }
      glow(x, y, 16, ramp[4], 0.35 * Math.max(0, 1 - t / life));
    },
  };
}
