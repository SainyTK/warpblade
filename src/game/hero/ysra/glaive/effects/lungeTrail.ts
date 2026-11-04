import { glowLine, line, place } from "../../../../../engine/frame";
import type { Effect } from "../../../../../types/effect";
import { WHITE } from "../../../../../utils/color";
import { skin } from "../../../skin";

/**
 * A streak of ember along the line a lunge ran, at blade height: white-hot at first, then cooling down her ramp from
 * the start of the line to the end. A rail pass draws it again, brighter.
 */
export function createLungeTrail(x0: number, x1: number, y: number, bright = false): Effect {
  const life = bright ? 0.3 : 0.4;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const u = t / life;
      const R = skin.ramp;
      const n = R.length;
      // the tail cools first: the start of the line fades out ahead of its end
      const from = x0 + (x1 - x0) * u * u;
      const hot = (v: number) =>
        u < 0.15 && v > 0.6 ? WHITE : R[Math.min(n - 1, Math.max(0, Math.round((1 - v * 0.6 - u * 0.5) * (n - 2))))];
      line(from, y, x1, y, hot);
      if (u < 0.6) line(from, y + 1, x1, y + 1, R[2], 1 - u);
      glowLine(from, y, x1, y, bright ? 8 : 6, R[3], (bright ? 0.5 : 0.35) * (1 - u));
    },
  };
}
