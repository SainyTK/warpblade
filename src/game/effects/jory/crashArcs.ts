import { PAL } from "../../../constants/palette";
import { fleck, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { ease } from "../../../utils/math";

/** the three arcs leave the drum one after another, this far apart in their life */
const STAGGER = 0.18;
const LIFE = 0.3;
/** how far each arc runs along the cone, and its half angle */
const HALF = 0.62;

/** three concentric cobalt arcs that leave the drum head along Crash's cone, the first brightest */
export function createCrashArcs(x: number, y: number, face: number, reach: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE + STAGGER * 2;
    },
    draw() {
      place();
      for (let i = 0; i < 3; i++) {
        const u = (t - i * STAGGER * LIFE) / LIFE;
        if (u < 0 || u > 1) continue;
        const r = 6 + (reach - 6) * ease.outCubic(u);
        const k = (1 - u) * (1 - i * 0.25);
        const c = PAL.beat[5 - i];
        const n = Math.max(10, Math.ceil(r * HALF * 4));
        for (let j = 0; j <= n; j++) {
          const a = -HALF + (2 * HALF * j) / n;
          fleck(x + face * Math.cos(a) * r, y + Math.sin(a) * r * 0.9, c, k * 1.8);
        }
      }
    },
  };
}
