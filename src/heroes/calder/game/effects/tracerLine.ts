import { fleck, glow, hairline, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";

const LIFE = 0.16;

/** a round's green tracer from (x0, y0) to (x1, y1): a bright line that fades from its tail, with a white head */
export function createTracerLine(x0: number, y0: number, x1: number, y1: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const k = 1 - t / LIFE;
      hairline(x0, y0, x1, y1, PHOSPHOR[4], (u) => k * u);
      hairline(x0, y0 - 0.5, x1, y1 - 0.5, PHOSPHOR[5], (u) => k * u * u);
      fleck(x1, y1, WHITE, k);
      glow(x1, y1, 7, PHOSPHOR[4], 0.4 * k);
    },
  };
}
