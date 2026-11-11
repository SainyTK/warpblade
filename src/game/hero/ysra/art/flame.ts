import { RES } from "../../../../constants/stage";
import { TONGUE } from "../../../../constants/ysra/fireLook";
import { fleck } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";

/**
 * a tongue of flame standing on (x, y), h tall, its tip leaning by `lean` art pixels: wide and hot at the root,
 * narrowing to a single image pixel at the tip and cooling down the ramp as it rises. `R` is an ember ramp, dark to
 * white over seven tones; `a` dithers the whole tongue.
 */
export function drawTongue(x: number, y: number, h: number, lean: number, R: Ramp, a = 1): void {
  const rows = Math.round(h * RES);
  for (let j = 0; j < rows; j++) {
    const u = j / rows;
    const cx = x + lean * u * u;
    const half = Math.max(0, Math.round((TONGUE.root * (1 - u) ** 1.5 - 1) / 2));
    const row = y - j / RES;
    for (let i = -half; i <= half; i++) {
      const edge = half ? Math.abs(i) / half : 0;
      const heat = 5 - Math.round(u * 2.4 + edge * 1.6);
      fleck(cx + i / RES, row, R[heat < 1 ? 1 : heat], a);
    }
  }
}
