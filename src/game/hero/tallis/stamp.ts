import type { PixelColors } from "../../../constants/effectColors";
import { RES } from "../../../constants/stage";
import { blendImage, putImage, toScreenX, toScreenY } from "../../../engine/frame";

/** how a small picture is stamped */
export interface StampLook {
  /** drawn facing left */
  flip?: boolean;
  /** how much of it shows, 0 to 1; letters in `solid` dither with it, the rest blend */
  show?: number;
  solid?: string;
  /** image pixels each row is pushed sideways, by its place from the top */
  sway?: (row: number) => number;
}

/**
 * A picture given as rows of image pixels, with the middle of its bottom row at (x, y) in art pixels: mirrored to face
 * left, blended so the scene shows through, and each row free to sway.
 */
export function stampSoft(rows: readonly string[], x: number, y: number, colors: PixelColors, look: StampLook): void {
  const { flip = false, show = 1, solid = "", sway } = look;
  const wide = rows[0].length;
  const left = Math.round(toScreenX(x) * RES - wide / 2);
  const top = Math.round(toScreenY(y) * RES) - rows.length;
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    const push = sway ? Math.round(sway(j)) : 0;
    for (let i = 0; i < wide; i++) {
      const letter = row[flip ? wide - 1 - i : i];
      const c = colors[letter];
      if (!c) continue;
      if (solid.includes(letter)) putImage(left + i + push, top + j, c, show);
      else blendImage(left + i + push, top + j, c, show);
    }
  }
}
