import { disc, glow, hairline, line, place, polygon } from "../../../../engine/frame";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP } from "../../constants/light";

/**
 * A knight of light standing at (x, y) facing `face`, `k` how solid he is (0 to 1), `swing` his sword arm from 0
 * raised to 1 cut through: a helm, a body of gold light, a kite shield before him and a white blade.
 */
export function drawLightKnight(x: number, y: number, face: number, k: number, swing: number): void {
  place();
  const a = 0.35 * k;
  polygon(
    [
      [x - 4 * face, y],
      [x + 3 * face, y],
      [x + 3 * face, y - 18],
      [x - 4 * face, y - 18],
    ],
    DAWN_RAMP[3],
    a,
  );
  disc(x, y - 22, 3.2, DAWN_RAMP[4], a + 0.15);
  hairline(x + face, y - 23, x + 3 * face, y - 23, WHITE, k);
  polygon(
    [
      [x + 3 * face, y - 20],
      [x + 8 * face, y - 20],
      [x + 8 * face, y - 13],
      [x + 5.5 * face, y - 8],
      [x + 3 * face, y - 13],
    ],
    DAWN_RAMP[5],
    a + 0.25,
  );
  const ang = -2.2 + swing * 2.9;
  const hx = x + 2 * face;
  const hy = y - 18;
  const tx = hx + Math.cos(ang) * 16 * face;
  const ty = hy + Math.sin(ang) * 16;
  line(hx, hy, tx, ty, DAWN_RAMP[5], k);
  hairline(hx, hy, tx, ty, WHITE, k);
  glow(x, y - 14, 16, DAWN_RAMP[4], 0.35 * k);
}
