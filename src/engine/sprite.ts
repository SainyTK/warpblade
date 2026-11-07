import { RES } from "../constants/stage";
import type { Color } from "../types/color";
import type { SpriteBox, SpriteImage } from "../types/sprite";
import { mix, scale } from "../utils/color";
import { blendImage, putImage, shakeOffset } from "./frame";

/**
 * A small canvas that builds a sprite part by part. Each part is drawn into a layer, then committed: where it overlaps
 * an earlier part its edge leaves a dark line in its own hue, and a final pass outlines the whole silhouette.
 * Shapes take local coordinates; res is how many image pixels one local pixel spans, so a canvas at res 2 draws the
 * same rig at twice the detail. w, h, ox and oy are in image pixels.
 */
export class SpriteCanvas implements SpriteImage {
  readonly d: Uint32Array;
  private readonly layer: Uint32Array;
  /** the box the layer has been drawn in, inclusive, so per-part passes only scan what the part touched */
  private x0 = 0;
  private y0 = 0;
  private x1: number;
  private y1: number;
  /** where the finished image has pixels, so clearing, outlining, mirroring and blitting skip the empty rest */
  readonly box: SpriteBox;
  constructor(
    readonly w: number,
    readonly h: number,
    readonly ox: number,
    readonly oy: number,
    readonly res = 1,
  ) {
    this.d = new Uint32Array(w * h);
    this.layer = new Uint32Array(w * h);
    this.x1 = w - 1;
    this.y1 = h - 1;
    this.box = { x0: 0, y0: 0, x1: w - 1, y1: h - 1 };
  }
  clear(): void {
    const { w, d, box } = this;
    if (box.x1 >= box.x0) for (let y = box.y0; y <= box.y1; y++) d.fill(0, y * w + box.x0, y * w + box.x1 + 1);
    box.x0 = this.w;
    box.y0 = this.h;
    box.x1 = -1;
    box.y1 = -1;
  }
  /** grow the image's box to take in this one, clamped to the canvas */
  private grow(x0: number, y0: number, x1: number, y1: number): void {
    const { box } = this;
    box.x0 = Math.max(0, Math.min(box.x0, x0));
    box.y0 = Math.max(0, Math.min(box.y0, y0));
    box.x1 = Math.min(this.w - 1, Math.max(box.x1, x1));
    box.y1 = Math.min(this.h - 1, Math.max(box.y1, y1));
  }
  begin(): void {
    const { w, layer, x0, x1 } = this;
    if (x1 >= x0) for (let y = this.y0; y <= this.y1; y++) layer.fill(0, y * w + x0, y * w + x1 + 1);
    this.x0 = this.w;
    this.y0 = this.h;
    this.x1 = -1;
    this.y1 = -1;
  }
  /** one image pixel */
  private put(ix: number, iy: number, c: Color): void {
    if (ix < 0 || iy < 0 || ix >= this.w || iy >= this.h) return;
    this.layer[iy * this.w + ix] = c;
    if (ix < this.x0) this.x0 = ix;
    if (ix > this.x1) this.x1 = ix;
    if (iy < this.y0) this.y0 = iy;
    if (iy > this.y1) this.y1 = iy;
  }
  private imageX = (x: number): number => x * this.res + this.ox;
  private imageY = (y: number): number => y * this.res + this.oy;
  /** the image pixel under this local point: at res 2 a single set is half a local pixel wide */
  set(x: number, y: number, c: Color): void {
    this.put(Math.floor(this.imageX(x)), Math.floor(this.imageY(y)), c);
  }
  dot(cx: number, cy: number, r: number, c: Color): void {
    const ix = this.imageX(cx);
    const iy = this.imageY(cy);
    const ir = r * this.res;
    for (let y = Math.floor(iy - ir); y <= Math.ceil(iy + ir); y++)
      for (let x = Math.floor(ix - ir); x <= Math.ceil(ix + ir); x++) {
        const dx = x + 0.5 - ix;
        const dy = y + 0.5 - iy;
        if (dx * dx + dy * dy <= ir * ir) this.put(x, y, c);
      }
  }
  stroke(x0: number, y0: number, x1: number, y1: number, r: number, c: Color): void {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * this.res));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      this.dot(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, r, c);
    }
  }
  poly(local: readonly (readonly [number, number])[], c: Color): void {
    const points = local.map(([x, y]) => [this.imageX(x), this.imageY(y)] as const);
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
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.put(x, y, c);
    }
  }
  /** a box of w by h art pixels filled image pixel by image pixel, its top left corner at this local point */
  block(x: number, y: number, c: Color, w = 1, h = w): void {
    const x0 = Math.floor(this.imageX(x));
    const y0 = Math.floor(this.imageY(y));
    const nx = Math.round(w * this.res);
    const ny = Math.round(h * this.res);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) this.put(x0 + i, y0 + j, c);
  }
  /** a line one image pixel wide between two local points: seams, cracks, veins and fine light */
  hairline(x0: number, y0: number, x1: number, y1: number, c: Color): void {
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * this.res));
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
  }
  /**
   * a horn, claw, limb or tendril from (x0, y0) to (x1, y1), narrowing from radius r0 at the base to r1 at the tip;
   * bend pushes the middle to the left of the line's direction, so the shape curves
   */
  taper(x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: Color, bend = 0): void {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = len > 0 ? (y1 - y0) / len : 0;
    const ny = len > 0 ? -(x1 - x0) / len : 0;
    const n = Math.max(1, Math.ceil(len * this.res));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const push = bend * 4 * u * (1 - u);
      this.dot(x0 + (x1 - x0) * u + nx * push, y0 + (y1 - y0) * u + ny * push, r0 + (r1 - r0) * u, c);
    }
  }
  /** pixel rows in image pixels, one character per pixel, "." is empty, the top left corner at this local point */
  pixels(rows: readonly string[], map: Record<string, Color>, x: number, y: number): void {
    const x0 = Math.floor(this.imageX(x));
    const y0 = Math.floor(this.imageY(y));
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] !== ".") this.put(x0 + i, y0 + j, map[row[i]]);
    });
  }
  /**
   * Light the layer's pixels of one colour from the top left: those with nothing above-left of them take the light
   * colour, and those with nothing below-right of them, within depth pixels, take the dark one.
   */
  shadeEdges(base: Color, light: Color, dark: Color, depth = 1): void {
    const { w, h, layer } = this;
    const lit = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < w && y < h && layer[y * w + x] !== 0;
    const at: number[] = [];
    const to: Color[] = [];
    for (let y = this.y0; y <= this.y1; y++)
      for (let x = this.x0; x <= this.x1; x++) {
        if (layer[y * w + x] !== base) continue;
        let c = 0;
        if (!lit(x - 1, y - 1) || !lit(x - 1, y) || !lit(x, y - 1)) c = light;
        else for (let k = 1; k <= depth; k++) if (!lit(x + k, y + k) || !lit(x + k, y)) c = dark;
        if (!c) continue;
        at.push(y * w + x);
        to.push(c);
      }
    for (let i = 0; i < at.length; i++) layer[at[i]] = to[i];
  }
  commit(innerLines = true): void {
    const { w, h, d, layer } = this;
    if (this.x1 < this.x0) return;
    if (innerLines) {
      const ya = Math.max(0, this.y0 - 1);
      const yb = Math.min(h - 1, this.y1 + 1);
      const xa = Math.max(0, this.x0 - 1);
      const xb = Math.min(w - 1, this.x1 + 1);
      for (let y = ya; y <= yb; y++)
        for (let x = xa; x <= xb; x++) {
          const i = y * w + x;
          if (layer[i] || !d[i]) continue;
          const n =
            (x > 0 && layer[i - 1]) ||
            (x < w - 1 && layer[i + 1]) ||
            (y > 0 && layer[i - w]) ||
            (y < h - 1 && layer[i + w]);
          if (n) d[i] = scale(n, 0.45);
        }
    }
    for (let y = this.y0; y <= this.y1; y++)
      for (let x = this.x0; x <= this.x1; x++) {
        const i = y * w + x;
        if (layer[i]) d[i] = layer[i];
      }
    this.grow(this.x0, this.y0, this.x1, this.y1);
  }
  outline(c: Color): void {
    const { w, h, d, box } = this;
    if (box.x1 < box.x0) return;
    const ring: number[] = [];
    for (let y = Math.max(0, box.y0 - 1); y <= Math.min(h - 1, box.y1 + 1); y++)
      for (let x = Math.max(0, box.x0 - 1); x <= Math.min(w - 1, box.x1 + 1); x++) {
        const i = y * w + x;
        if (d[i]) continue;
        if ((x > 0 && d[i - 1]) || (x < w - 1 && d[i + 1]) || (y > 0 && d[i - w]) || (y < h - 1 && d[i + w]))
          ring.push(i);
      }
    for (const i of ring) d[i] = c;
    this.grow(box.x0 - 1, box.y0 - 1, box.x1 + 1, box.y1 + 1);
  }
  /** flip the drawn sprite left to right about local x = 0, the same way a flipped blit does */
  mirror(): void {
    const { w, d, layer, ox, box } = this;
    if (box.x1 < box.x0) return;
    const { x0, y0, x1, y1 } = box;
    // the layer holds the image while it is flipped back into d, and is cleared at the next begin
    this.begin();
    for (let y = y0; y <= y1; y++) {
      layer.set(d.subarray(y * w + x0, y * w + x1 + 1), y * w + x0);
      d.fill(0, y * w + x0, y * w + x1 + 1);
    }
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    box.x0 = w;
    box.x1 = -1;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const mx = 2 * ox - x;
        if (mx >= 0 && mx < w) d[y * w + mx] = layer[y * w + x];
      }
    this.grow(2 * ox - x1, y0, 2 * ox - x0, y1);
  }
  snapshot(): SpriteImage {
    return { w: this.w, h: this.h, ox: this.ox, oy: this.oy, res: this.res, d: this.d.slice(), box: { ...this.box } };
  }
}

/**
 * a canvas at the frame's full detail, sized in art pixels with its feet at (ox, oy): heroes and foes are drawn on these,
 * so one art pixel holds RES by RES image pixels for edges, lights and glints
 */
export const detailCanvas = (w: number, h: number, ox: number, oy: number): SpriteCanvas =>
  new SpriteCanvas(w * RES, h * RES, ox * RES, oy * RES, RES);

export interface BlitOptions {
  alpha?: number;
  tint?: Color;
  tintAmount?: number;
  /** blend translucently instead of dithering */
  soft?: boolean;
}
/**
 * draw a sprite with its feet at (x, y), in art pixels. Each sprite pixel covers RES / s.res image pixels a side:
 * a classic sprite keeps its art pixel blocks, a detailed one lands pixel for pixel, placed to the half art pixel.
 */
export function blit(s: SpriteImage, x: number, y: number, flip: boolean, o: BlitOptions = {}): void {
  const { alpha = 1, tint = 0, tintAmount = 0, soft = false } = o;
  const [shx, shy] = shakeOffset();
  const k = Math.max(1, Math.round(RES / s.res));
  const step = RES / k;
  const bx = Math.floor((x + shx) * step) * k;
  const by = Math.floor((y + shy) * step) * k;
  const box = s.box ?? { x0: 0, y0: 0, x1: s.w - 1, y1: s.h - 1 };
  for (let j = box.y0; j <= box.y1; j++)
    for (let i = box.x0; i <= box.x1; i++) {
      const c = s.d[j * s.w + i];
      if (!c) continue;
      const ix = flip ? bx + (s.ox - i) * k : bx + (i - s.ox) * k;
      const iy = by + (j - s.oy) * k;
      const col = tintAmount > 0 ? mix(c, tint, tintAmount) : c;
      for (let v = 0; v < k; v++)
        for (let u = 0; u < k; u++) {
          if (soft) blendImage(ix + u, iy + v, col, alpha);
          else putImage(ix + u, iy + v, col, alpha);
        }
    }
}

/**
 * paint the image pixels within `width` of a sprite drawn at (x, y), placed the way blit places it, that the sprite
 * leaves empty: a ring around its silhouette. `col` picks each pixel's colour from its image position.
 */
export function blitRing(
  s: SpriteImage,
  x: number,
  y: number,
  flip: boolean,
  width: number,
  col: (ix: number, iy: number) => Color,
): void {
  const [shx, shy] = shakeOffset();
  const k = Math.max(1, Math.round(RES / s.res));
  const step = RES / k;
  const bx = Math.floor((x + shx) * step) * k;
  const by = Math.floor((y + shy) * step) * k;
  const box = s.box ?? { x0: 0, y0: 0, x1: s.w - 1, y1: s.h - 1 };
  const filled = (i: number, j: number): boolean => i >= 0 && j >= 0 && i < s.w && j < s.h && s.d[j * s.w + i] !== 0;
  const near = (i: number, j: number): boolean => {
    for (let v = -width; v <= width; v++)
      for (let u = Math.abs(v) - width; u <= width - Math.abs(v); u++) if (filled(i + u, j + v)) return true;
    return false;
  };
  for (let j = box.y0 - width; j <= box.y1 + width; j++)
    for (let i = box.x0 - width; i <= box.x1 + width; i++) {
      if (filled(i, j) || !near(i, j)) continue;
      const ix = flip ? bx + (s.ox - i) * k : bx + (i - s.ox) * k;
      const iy = by + (j - s.oy) * k;
      for (let v = 0; v < k; v++) for (let u = 0; u < k; u++) putImage(ix + u, iy + v, col(ix + u, iy + v));
    }
}
