import { GLYPH, GLYPHS } from "../constants/font";
import { RES } from "../constants/stage";
import { putImage, shakeOffset } from "../engine/frame";
import type { Color } from "../types/color";

/** the glyph rows from this one down take the darker ink, so a figure reads as lit from above */
const SHADE_FROM = 3;

/** the width of a text in art pixels when a glyph pixel is `cell` image pixels a side */
export const fineTextWidth = (text: string, cell: number): number =>
  ((text.length * (GLYPH.w + GLYPH.gap) - GLYPH.gap) * cell) / RES;

/** every ink pixel of a text as an image pixel square `cell` a side, grown by `grow` image pixels on each side */
function stamp(
  text: string,
  left: number,
  top: number,
  cell: number,
  grow: number,
  c: (row: number) => Color,
  a: number,
) {
  for (let i = 0; i < text.length; i++) {
    const g = GLYPHS[text[i]];
    if (!g) continue;
    const gx = left + i * (GLYPH.w + GLYPH.gap) * cell;
    for (let r = 0; r < GLYPH.h; r++)
      for (let col = 0; col < GLYPH.w; col++) {
        if (g[r][col] !== "#") continue;
        const x0 = gx + col * cell - grow;
        const y0 = top + r * cell - grow;
        const ink = c(r);
        for (let dy = 0; dy < cell + grow * 2; dy++)
          for (let dx = 0; dx < cell + grow * 2; dx++) putImage(x0 + dx, y0 + dy, ink, a);
      }
  }
}

/**
 * pixel text centered on x with its top at y, in art pixels: each glyph pixel is `cell` image pixels a side, the lower
 * rows in `shade`, ringed by an edge a single image pixel wide so it covers little of what is behind it
 */
export function drawFineText(
  text: string,
  x: number,
  y: number,
  ink: Color,
  shade: Color,
  edge: Color,
  cell: number,
  a = 1,
): void {
  const [shx, shy] = shakeOffset();
  const left = Math.round((x + shx) * RES - (fineTextWidth(text, cell) * RES) / 2);
  const top = Math.round((y + shy) * RES);
  stamp(text, left, top, cell, 1, () => edge, a);
  stamp(text, left, top, cell, 0, (row) => (row >= SHADE_FROM ? shade : ink), a);
}
