import { GLYPH, GLYPHS } from "../constants/font";
import type { Color } from "../types/color";
import { putScreen, shakeOffset } from "./frame";

export const textWidth = (text: string, scale = 1): number => (text.length * (GLYPH.w + GLYPH.gap) - GLYPH.gap) * scale;

/** pixel text centered on x with its top at y, each ink pixel scaled up, ringed by a dark outline */
export function drawText(text: string, x: number, y: number, c: Color, outline: Color, scale = 1, a = 1): void {
  const [shx, shy] = shakeOffset();
  const left = Math.round(x - textWidth(text, scale) / 2) + shx;
  const top = Math.round(y) + shy;
  const ink = (fn: (sx: number, sy: number) => void) => {
    for (let i = 0; i < text.length; i++) {
      const g = GLYPHS[text[i]];
      if (!g) continue;
      const gx = left + i * (GLYPH.w + GLYPH.gap) * scale;
      for (let r = 0; r < GLYPH.h; r++)
        for (let col = 0; col < GLYPH.w; col++) {
          if (g[r][col] !== "#") continue;
          for (let dy = 0; dy < scale; dy++)
            for (let dx = 0; dx < scale; dx++) fn(gx + col * scale + dx, top + r * scale + dy);
        }
    }
  };
  ink((sx, sy) => {
    for (const [ox, oy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      putScreen(sx + ox, sy + oy, outline, a);
  });
  ink((sx, sy) => putScreen(sx, sy, c, a));
}
