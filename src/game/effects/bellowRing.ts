import { BELLOW } from "../../constants/hulda/bellow";
import { ellipseRing, glow, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { ease } from "../../utils/math";

/**
 * Bellow: three rings run out from her mouth to the roar's reach, and every foe it caught is dragged toward her over a
 * quarter of a second, walkers sliding along the floor and fliers drifting.
 */
export function createBellowRing(x: number, y: number, caught: readonly Enemy[], toward: number, ramp: Ramp): Effect {
  const pulls = caught.map((e) => ({
    e,
    dx: Math.sign(toward - e.x) * Math.min(BELLOW.pull, Math.abs(toward - e.x) - 8),
  }));
  const life = BELLOW.ringTime + BELLOW.ringGap * 2;
  let t = 0;
  return {
    update(dt) {
      const step = Math.min(dt, Math.max(0, BELLOW.pullTime - t)) / BELLOW.pullTime;
      for (const p of pulls) if (p.e.hp > 0 && p.dx * Math.sign(p.dx) > 0) p.e.x += p.dx * step;
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
