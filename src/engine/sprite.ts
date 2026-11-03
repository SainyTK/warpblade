import type { Color } from "../types/color";
import type { SpriteImage } from "../types/sprite";
import { mix, scale } from "../utils/color";
import { blendScreen, putScreen, shakeOffset } from "./frame";

/**
 * A small canvas that builds a sprite part by part. Each part is drawn into a layer, then committed: where it overlaps
 * an earlier part its edge leaves a dark line in its own hue, and a final pass outlines the whole silhouette.
 */
export class SpriteCanvas implements SpriteImage {
  readonly d: Uint32Array;
  private readonly layer: Uint32Array;
  constructor(
    readonly w: number,
    readonly h: number,
    readonly ox: number,
    readonly oy: number,
  ) {
    this.d = new Uint32Array(w * h);
    this.layer = new Uint32Array(w * h);
  }
  clear(): void {
    this.d.fill(0);
  }
  begin(): void {
    this.layer.fill(0);
  }
  set(x: number, y: number, c: Color): void {
    const ix = Math.floor(x + this.ox);
    const iy = Math.floor(y + this.oy);
    if (ix < 0 || iy < 0 || ix >= this.w || iy >= this.h) return;
    this.layer[iy * this.w + ix] = c;
  }
  dot(cx: number, cy: number, r: number, c: Color): void {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r * r) this.set(x, y, c);
      }
  }
  stroke(x0: number, y0: number, x1: number, y1: number, r: number, c: Color): void {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      this.dot(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, r, c);
    }
  }
  poly(points: readonly (readonly [number, number])[], c: Color): void {
    let top = Number.POSITIVE_INFINITY;
    let bottom = Number.NEGATIVE_INFINITY;
    for (const p of points) {
      top = Math.min(top, p[1]);
      bottom = Math.max(bottom, p[1]);
    }
    for (let y = Math.floor(top); y <= Math.ceil(bottom); y++) {
      const yc = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc))
          xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
      xs.sort((m, n) => m - n);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.set(x, y, c);
    }
  }
  /** pixel rows, one character per pixel, "." is empty */
  pixels(rows: readonly string[], map: Record<string, Color>, x: number, y: number): void {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] !== ".") this.set(x + i, y + j, map[row[i]]);
    });
  }
  commit(innerLines = true): void {
    const { w, h, d, layer } = this;
    if (innerLines)
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          if (layer[i] || !d[i]) continue;
          const n =
            (x > 0 && layer[i - 1]) ||
            (x < w - 1 && layer[i + 1]) ||
            (y > 0 && layer[i - w]) ||
            (y < h - 1 && layer[i + w]);
          if (n) d[i] = scale(n, 0.45);
        }
    for (let i = 0; i < layer.length; i++) if (layer[i]) d[i] = layer[i];
  }
  outline(c: Color): void {
    const { w, h, d, layer } = this;
    layer.set(d);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (layer[i]) continue;
        if (
          (x > 0 && layer[i - 1]) ||
          (x < w - 1 && layer[i + 1]) ||
          (y > 0 && layer[i - w]) ||
          (y < h - 1 && layer[i + w])
        )
          d[i] = c;
      }
  }
  /** flip the drawn sprite left to right about local x = 0, the same way a flipped blit does */
  mirror(): void {
    const { w, h, d, layer, ox } = this;
    layer.set(d);
    d.fill(0);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const mx = 2 * ox - x;
        if (mx >= 0 && mx < w) d[y * w + mx] = layer[y * w + x];
      }
  }
  snapshot(): SpriteImage {
    return { w: this.w, h: this.h, ox: this.ox, oy: this.oy, d: this.d.slice() };
  }
}

export interface BlitOptions {
  alpha?: number;
  tint?: Color;
  tintAmount?: number;
  /** blend translucently instead of dithering */
  soft?: boolean;
}
/** draw a sprite with its feet at (x, y) */
export function blit(s: SpriteImage, x: number, y: number, flip: boolean, o: BlitOptions = {}): void {
  const { alpha = 1, tint = 0, tintAmount = 0, soft = false } = o;
  const [shx, shy] = shakeOffset();
  const bx = Math.floor(x) + shx;
  const by = Math.floor(y) + shy;
  for (let j = 0; j < s.h; j++)
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + i];
      if (!c) continue;
      const sx = flip ? bx + (s.ox - i) : bx + (i - s.ox);
      const sy = by + j - s.oy;
      const col = tintAmount > 0 ? mix(c, tint, tintAmount) : c;
      if (soft) blendScreen(sx, sy, col, alpha);
      else putScreen(sx, sy, col, alpha);
    }
}
