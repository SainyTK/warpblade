import { ellipseRing, glow, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { JADE } from "../../look";

const LIFE = 0.3;

/** a ring of qi that opens round a point and fades: Cloud Step's second jump */
export function createQiRing(x: number, y: number, radius: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const r = radius * (0.4 + 0.6 * Math.sqrt(u));
      ellipseRing(x, y, r, r * 0.5, JADE[4], 1 - u);
      ellipseRing(x, y, r - 2, (r - 2) * 0.5, JADE[2], 0.6 * (1 - u));
      glow(x, y, r * 0.7, JADE[3], 0.25 * (1 - u));
    },
  };
}
