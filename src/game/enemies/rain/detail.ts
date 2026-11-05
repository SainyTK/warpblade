import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/** one whole art pixel, two by two image pixels, at this local point: for details that must hold up at game size */
export function block(s: SpriteCanvas, x: number, y: number, c: Color): void {
  const h = 1 / s.res;
  s.set(x, y, c);
  s.set(x + h, y, c);
  s.set(x, y + h, c);
  s.set(x + h, y + h, c);
}

/** a wet or metallic glint: two image pixels side by side, half an art pixel tall */
export function glint(s: SpriteCanvas, x: number, y: number, c: Color): void {
  s.set(x, y, c);
  s.set(x + 1 / s.res, y, c);
}

/** a line one image pixel thin, for hairline veins, cracks and sparks */
export function hairline(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number, c: Color): void {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * s.res * 1.5));
  for (let i = 0; i <= n; i++) s.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
}
