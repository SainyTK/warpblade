import { RES } from "../../../constants/stage";
import { putImage, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";

/**
 * Draw a shape that is turned to face along (ux, uy), image pixel by image pixel, so it stays crisp at any angle. For
 * every pixel within `reach` art pixels of (x, y), `tone` is given how far the pixel lies along the direction and
 * across it (to the direction's right, on screen), in art pixels, and returns its colour, or 0 to leave it empty.
 */
export function drawTurned(
  x: number,
  y: number,
  ux: number,
  uy: number,
  reach: number,
  tone: (along: number, across: number) => Color,
  a = 1,
): void {
  const cx = toScreenX(x) * RES;
  const cy = toScreenY(y) * RES;
  const r = Math.ceil(reach * RES);
  const left = Math.floor(cx);
  const top = Math.floor(cy);
  for (let py = top - r; py <= top + r; py++)
    for (let px = left - r; px <= left + r; px++) {
      const dx = (px + 0.5 - cx) / RES;
      const dy = (py + 0.5 - cy) / RES;
      const c = tone(dx * ux + dy * uy, dy * ux - dx * uy);
      if (c) putImage(px, py, c, a);
    }
}
