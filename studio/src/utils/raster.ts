import type { Color } from '@game/types/color';
import type { SpriteImage } from '@game/types/sprite';
import { mix } from '@game/utils/color';
import { parsePixelKey } from '@shared/utils/celRows';
import type { Raster } from '@/types/studio';

export const raster = (w: number, h: number, fill: Color = 0): Raster => ({
  w,
  h,
  d: new Uint32Array(w * h).fill(fill),
});

export function put(r: Raster, x: number, y: number, c: Color, alpha = 1): void {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || iy < 0 || ix >= r.w || iy >= r.h || !c) {
    return;
  }
  const i = iy * r.w + ix;
  r.d[i] = alpha >= 1 ? c : mix(r.d[i] ?? 0, c, alpha);
}

export interface BlitStyle {
  alpha?: number;
  tint?: Color;
  tintAmount?: number;
}

/** Draws a sprite with its feet at (x, y). */
export function blitSprite(
  r: Raster,
  s: SpriteImage,
  x: number,
  y: number,
  style: BlitStyle = {},
): void {
  const { alpha = 1, tint = 0, tintAmount = 0 } = style;
  const bx = Math.round(x);
  const by = Math.round(y);
  for (let j = 0; j < s.h; j++) {
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + i];
      if (c) {
        put(r, bx + i - s.ox, by + j - s.oy, tintAmount ? mix(c, tint, tintAmount) : c, alpha);
      }
    }
  }
}

/** Draws an effect frame's pixels with its origin at (x, y). */
export function blitPixels(
  r: Raster,
  pixels: Readonly<Record<string, number>>,
  x: number,
  y: number,
  style: BlitStyle = {},
): void {
  const { alpha = 1, tint = 0, tintAmount = 0 } = style;
  for (const [key, c] of Object.entries(pixels)) {
    const [px, py] = parsePixelKey(key);
    put(r, x + px, y + py, tintAmount ? mix(c, tint, tintAmount) : c, alpha);
  }
}

/** RGBA bytes for ImageData; empty pixels are transparent. */
export function rgba(r: Raster): Uint8ClampedArray<ArrayBuffer> {
  const out = new Uint8ClampedArray(r.w * r.h * 4);
  r.d.forEach((c, i) => {
    if (!c) {
      return;
    }
    out[i * 4] = (c >> 16) & 255;
    out[i * 4 + 1] = (c >> 8) & 255;
    out[i * 4 + 2] = c & 255;
    out[i * 4 + 3] = 255;
  });
  return out;
}
