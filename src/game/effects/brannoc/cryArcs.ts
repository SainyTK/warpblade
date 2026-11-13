import { PAL } from "../../../constants/palette";
import { place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { ease } from "../../../utils/math";

/** the arcs leave one after another, and live this long */
const ARCS = 3;
const GAP = 0.06;
const LIFE = 0.32;
/** each arc spans this angle either side of his facing */
const SPAN = 0.9;

/**
 * War Cry's roar: three crimson arcs that leave his mouth one after another and swell out to the cry's reach, thinning
 * and darkening as they go, the outer one first.
 */
export function createCryArcs(x: number, y: number, face: number, reach: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE + GAP * ARCS;
    },
    draw() {
      place();
      for (let a = 0; a < ARCS; a++) {
        const u = (t - a * GAP) / LIFE;
        if (u <= 0 || u >= 1) continue;
        const r = 4 + (reach - 4) * ease.outCubic(u);
        const c = PAL.rage[Math.max(1, 5 - Math.floor(u * 4))];
        const k = 1 - u;
        const steps = Math.max(6, Math.round(r * SPAN));
        for (let i = 0; i <= steps; i++) {
          const g = -SPAN + (2 * SPAN * i) / steps;
          px(x + face * Math.cos(g) * r, y + Math.sin(g) * r * 0.8, c, k);
        }
      }
    },
  };
}
