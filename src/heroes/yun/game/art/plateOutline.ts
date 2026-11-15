import { blendScreen, toScreenX, toScreenY } from "../../../../engine/frame";
import type { Color } from "../../../../types/color";

/** an oval's outline on whole art pixels, each blended once with no dither: `rim` on the pixels just inside its edge,
 *  `edge` on those just outside, so it reads on light and dark ground alike */
export function drawPlateOutline(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rim: Color,
  rimA: number,
  edge: Color,
  edgeA: number,
): void {
  const cx = toScreenX(x);
  const cy = toScreenY(y);
  const inside = (sx: number, sy: number): boolean => ((sx + 0.5 - cx) / rx) ** 2 + ((sy + 0.5 - cy) / ry) ** 2 < 1;
  const x0 = Math.floor(cx - rx) - 1;
  const x1 = Math.ceil(cx + rx) + 1;
  const y0 = Math.floor(cy - ry) - 1;
  const y1 = Math.ceil(cy + ry) + 1;
  for (let sy = y0; sy <= y1; sy++)
    for (let sx = x0; sx <= x1; sx++) {
      const own = inside(sx, sy);
      const across = [inside(sx - 1, sy), inside(sx + 1, sy), inside(sx, sy - 1), inside(sx, sy + 1)].some(
        (n) => n !== own,
      );
      if (!across) continue;
      if (own) blendScreen(sx, sy, rim, rimA);
      else blendScreen(sx, sy, edge, edgeA);
    }
}
