import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/** a glowing eye one art pixel across: a ring of glow round a hot core in its top left image pixel */
export function glowEye(s: SpriteCanvas, x: number, y: number, glow: Color, core: Color): void {
  s.block(x, y, glow);
  s.set(x, y, core);
}
