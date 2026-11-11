import { GLOAM_SLASH } from "../../../constants/clips/tallis/moves";
import { PAL } from "../../../constants/palette";
import { glowLine, hairline, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { WHITE } from "../../../utils/color";
import { drawForm, poseForm } from "./shadowForm";

/** seconds the shade he leaves behind a foe lingers, and the thread between two visits */
const SHADE_LIFE = 0.42;
const THREAD_LIFE = 0.22;

/** the shade he leaves where he stood behind a foe: his slash pose in ink and rose, thinning away */
export function createGloamShade(x: number, y: number, face: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < SHADE_LIFE;
    },
    draw() {},
    drawBack() {
      place();
      drawForm(poseForm(GLOAM_SLASH), x, y, face < 0, { ink: 1, squash: 1, show: 0.85 * (1 - t / SHADE_LIFE) });
    },
  };
}

/** the thread of dusk light from one visit to the next: a fine rose line with a white seam, gone almost at once */
export function createGloamThread(x0: number, y0: number, x1: number, y1: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < THREAD_LIFE;
    },
    draw() {
      place();
      const k = 1 - t / THREAD_LIFE;
      // the line is brightest where he arrived and trails off toward where he left
      hairline(x0, y0 + 0.5, x1, y1 + 0.5, PAL.gloam[3], (u) => k * u);
      hairline(x0, y0, x1, y1, PAL.gloam[4], (u) => k * (0.3 + 0.7 * u));
      if (k > 0.5) hairline(x0, y0, x1, y1, WHITE, (u) => (k - 0.5) * 2 * u * u);
      glowLine(x0, y0, x1, y1, 5, PAL.gloam[4], 0.3 * k);
    },
  };
}
