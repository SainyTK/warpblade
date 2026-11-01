import { circle, place, sparkle } from "../../engine/frame";
import type { Color } from "../../types/color";
import type { Effect } from "../../types/effect";
import { WHITE } from "../../utils/color";

/** a short glint, for a spell leaving the hand */
export function createGlint(x: number, y: number, c: Color): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < 0.12;
    },
    draw() {
      place();
      sparkle(x, y, 7 * (1 - t / 0.12) + 1, WHITE, c, 0.6);
    },
  };
}
/** a hot disc for the first frames of an explosion */
export function createBlastCore(x: number, y: number, hot: Color): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < 0.08;
    },
    draw() {
      place();
      circle(x, y, 12 * (1 - t / 0.08) + 4, t < 0.04 ? WHITE : hot);
    },
  };
}
