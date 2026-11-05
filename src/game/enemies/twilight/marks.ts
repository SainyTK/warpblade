import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/** a line one image pixel wide between two local points: seams, cracks, veins and rune light */
export function hairline(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number, c: Color): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * s.res));
  for (let i = 0; i <= n; i++) s.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
}

/** a glint one art pixel square, its top left corner at this local point */
export function glint(s: SpriteCanvas, x: number, y: number, c: Color): void {
  const half = 1 / s.res;
  for (let v = 0; v < s.res; v++) for (let u = 0; u < s.res; u++) s.set(x + u * half, y + v * half, c);
}
