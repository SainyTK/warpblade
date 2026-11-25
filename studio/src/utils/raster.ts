import type { Color } from '@game/types/color';
import type { SpriteImage } from '@game/types/sprite';
import { mix } from '@game/utils/color';
import type { Raster } from '@/types/studio';

/** A raster `w` by `h` art pixels across, `res` image pixels to an art pixel. */
export const raster = (w: number, h: number, fill: Color = 0, res = 1): Raster => ({
  w: w * res,
  h: h * res,
  res,
  d: new Uint32Array(w * res * h * res).fill(fill),
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

/** Fills the art pixel at (x, y). */
export function putArt(r: Raster, x: number, y: number, c: Color, alpha = 1): void {
  const left = Math.floor(x) * r.res;
  const top = Math.floor(y) * r.res;
  for (let j = 0; j < r.res; j++) {
    for (let i = 0; i < r.res; i++) {
      put(r, left + i, top + j, c, alpha);
    }
  }
}

export interface BlitStyle {
  alpha?: number;
  tint?: Color;
  tintAmount?: number;
}

/** Draws a sprite with its feet at (x, y) in art pixels, each sprite pixel as wide as the raster's detail allows. */
export function blitSprite(
  r: Raster,
  s: SpriteImage,
  x: number,
  y: number,
  style: BlitStyle = {},
): void {
  const { alpha = 1, tint = 0, tintAmount = 0 } = style;
  const k = Math.max(1, Math.round(r.res / s.res));
  const bx = Math.round(x * r.res) - s.ox * k;
  const by = Math.round(y * r.res) - s.oy * k;
  for (let j = 0; j < s.h; j++) {
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + i];
      if (!c) {
        continue;
      }
      const color = tintAmount ? mix(c, tint, tintAmount) : c;
      for (let v = 0; v < k; v++) {
        for (let u = 0; u < k; u++) {
          put(r, bx + i * k + u, by + j * k + v, color, alpha);
        }
      }
    }
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

/** The raster on a canvas of its own size, to draw scaled elsewhere. */
export function rasterCanvas(r: Raster): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = r.w;
  canvas.height = r.h;
  canvas.getContext('2d')?.putImageData(new ImageData(rgba(r), r.w), 0, 0);
  return canvas;
}
