import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/** a wet or metallic glint: two image pixels side by side, half an art pixel tall */
export function glint(s: SpriteCanvas, x: number, y: number, c: Color): void {
  s.set(x, y, c);
  s.set(x + 1 / s.res, y, c);
}
