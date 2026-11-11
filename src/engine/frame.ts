// The frame: a color buffer (opaque pixels, faded by a 4x4 Bayer dither or truly blended for smoke) and an additive
// light buffer composited on top. The two-buffer model and Bayer threshold follow Sprite Fusion's open-source pixel art
// VFX (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
// Both buffers hold RES image pixels per art pixel. Callers draw in art pixels: shapes, lines and light are rasterized
// at the finer image grid, single art pixels (px, putScreen, text) fill a RES by RES block.
import { FH, FN, FW, H, N, RES, W } from "../constants/stage";
import type { Alpha, Color, Paint } from "../types/color";
import { cb, cg, cr, mix, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";

export const color = new Uint32Array(FN);
/** light is soft, so it is kept per art pixel and spread over each pixel's image block when composited */
export const lightR = new Float32Array(N);
export const lightG = new Float32Array(N);
export const lightB = new Float32Array(N);
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export const bayerAt = (x: number, y: number): number => BAYER[((y & 3) << 2) | (x & 3)];

/** Drawing happens in local coordinates placed at (tx, ty), mirrored when fx is -1; shx, shy is the screen shake. */
const placement = { tx: 0, ty: 0, fx: 1, shx: 0, shy: 0 };
export function setShake(x: number, y: number): void {
  placement.shx = x;
  placement.shy = y;
}
export const shakeOffset = (): readonly [number, number] => [placement.shx, placement.shy];
export function place(x = 0, y = 0, flip = false): void {
  placement.tx = x + placement.shx;
  placement.ty = y + placement.shy;
  placement.fx = flip ? -1 : 1;
}
/** local to screen, in art pixels */
export const toScreenX = (x: number): number => placement.tx + x * placement.fx;
export const toScreenY = (y: number): number => placement.ty + y;
/** screen image pixel back to local art pixels, at the image pixel's center */
const localX = (ix: number): number => ((ix + 0.5) / RES - placement.tx) * placement.fx;
const localY = (iy: number): number => (iy + 0.5) / RES - placement.ty;

const paint = (c: Paint, u: number, v?: number): Color => (typeof c === "function" ? c(u, v) : c);
const alpha = (a: Alpha, u: number): number => (typeof a === "function" ? a(u) : a);

// ---- raw image pixel writes
export function putImage(ix: number, iy: number, c: Color, a = 1): void {
  if (!c || a <= 0) return;
  if (a < 1 && a <= bayerAt(ix, iy)) return;
  if (ix < 0 || iy < 0 || ix >= FW || iy >= FH) return;
  color[iy * FW + ix] = c;
}
export function blendImage(ix: number, iy: number, c: Color, a: number): void {
  if (a <= 0.01 || ix < 0 || iy < 0 || ix >= FW || iy >= FH) return;
  const i = iy * FW + ix;
  color[i] = mix(color[i], c, Math.min(1, a));
}
/** a RES by RES block of image pixels with its top left corner here */
function putBlock(ix: number, iy: number, c: Color, a: number): void {
  for (let v = 0; v < RES; v++) for (let u = 0; u < RES; u++) putImage(ix + u, iy + v, c, a);
}

// ---- whole art pixel writes, screen coordinates
export function putScreen(sx: number, sy: number, c: Color, a = 1): void {
  putBlock(Math.floor(sx) * RES, Math.floor(sy) * RES, c, a);
}
export function blendScreen(sx: number, sy: number, c: Color, a: number): void {
  const x0 = Math.floor(sx) * RES;
  const y0 = Math.floor(sy) * RES;
  for (let v = 0; v < RES; v++) for (let u = 0; u < RES; u++) blendImage(x0 + u, y0 + v, c, a);
}

// ---- shapes, local coordinates
/** one art pixel, placed to the image pixel so moving sparks glide in half steps */
export function px(x: number, y: number, c: Color, a = 1): void {
  const cx = toScreenX(x + 0.5);
  const cy = toScreenY(y + 0.5);
  putBlock(Math.round(cx * RES - RES / 2), Math.round(cy * RES - RES / 2), c, a);
}
/** half an art pixel: a single image pixel, for the fine end of sparks and glints */
export function fleck(x: number, y: number, c: Color, a = 1): void {
  putImage(Math.floor(toScreenX(x) * RES), Math.floor(toScreenY(y) * RES), c, a);
}
/** a line one image pixel wide, for tails and edges finer than an art pixel */
export function hairline(x0: number, y0: number, x1: number, y1: number, c: Paint, a: Alpha = 1): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 1.4 * RES));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    fleck(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, paint(c, u), alpha(a, u));
  }
}
export function line(x0: number, y0: number, x1: number, y1: number, c: Paint, a: Alpha = 1): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 1.4 * RES));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    px(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, paint(c, u), alpha(a, u));
  }
}
/** the image pixel box around a local circle; center and radius in image pixels */
function imageBox(x: number, y: number, r: number) {
  const cx = toScreenX(x) * RES;
  const cy = toScreenY(y) * RES;
  const ir = r * RES;
  return {
    cx,
    cy,
    ir,
    x0: Math.max(0, Math.floor(cx - ir)),
    x1: Math.min(FW - 1, Math.ceil(cx + ir)),
    y0: Math.max(0, Math.floor(cy - ir)),
    y1: Math.min(FH - 1, Math.ceil(cy + ir)),
  };
}
/** solid disc, dithered when a < 1 */
export function circle(x: number, y: number, r: number, c: Color, a = 1): void {
  const b = imageBox(x, y, r);
  for (let iy = b.y0; iy <= b.y1; iy++)
    for (let ix = b.x0; ix <= b.x1; ix++) {
      const dx = ix + 0.5 - b.cx;
      const dy = iy + 0.5 - b.cy;
      if (dx * dx + dy * dy <= b.ir * b.ir) putImage(ix, iy, c, a);
    }
}
/** translucent disc for smoke, mist and vapour; nothing is drawn below `floor` (a world y), so a floor in front hides it */
export function disc(x: number, y: number, r: number, c: Color, a: number, floor = Number.POSITIVE_INFINITY): void {
  if (a <= 0.01) return;
  const b = imageBox(x, y, r);
  const last = Number.isFinite(floor) ? Math.min(b.y1, Math.floor(toScreenY(floor) * RES) - 1) : b.y1;
  for (let iy = b.y0; iy <= last; iy++)
    for (let ix = b.x0; ix <= b.x1; ix++) {
      const d = Math.hypot(ix + 0.5 - b.cx, iy + 0.5 - b.cy) / RES;
      if (d <= r) blendImage(ix, iy, c, a * Math.min(1, (r - d) * 0.8 + 0.35));
    }
}
/**
 * a shadow lying on a floor seen edge on: the lower half of a soft oval hung from the floor line at screen (x, y),
 * rx wide and ry deep in art pixels, darkening what is there by up to k
 */
export function castShadow(x: number, y: number, rx: number, ry: number, k: number): void {
  if (k <= 0.01 || rx <= 0 || ry <= 0) return;
  const cx = (x + placement.shx) * RES;
  const top = Math.round((y + placement.shy) * RES);
  const irx = rx * RES;
  const iry = ry * RES;
  const x0 = Math.max(0, Math.floor(cx - irx));
  const x1 = Math.min(FW - 1, Math.ceil(cx + irx));
  for (let iy = Math.max(0, top); iy < Math.min(FH, top + iry); iy++) {
    const dy = (iy + 0.5 - top) / iry;
    for (let ix = x0; ix <= x1; ix++) {
      const dx = (ix + 0.5 - cx) / irx;
      const d = dx * dx + dy * dy;
      if (d >= 1) continue;
      const keep = 1 - k * (1 - d);
      const i = iy * FW + ix;
      const c = color[i];
      color[i] = ((((c >> 16) & 255) * keep) << 16) | ((((c >> 8) & 255) * keep) << 8) | ((c & 255) * keep) || 0x010101;
    }
  }
}
export function polygon(points: readonly (readonly [number, number])[], c: Paint, a = 1): void {
  const sp = points.map(([x, y]) => [toScreenX(x) * RES, toScreenY(y) * RES] as const);
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const p of sp) {
    top = Math.min(top, p[1]);
    bottom = Math.max(bottom, p[1]);
  }
  for (let y = Math.max(0, Math.floor(top)); y <= Math.min(FH - 1, Math.ceil(bottom)); y++) {
    const yc = y + 0.5;
    const xs: number[] = [];
    for (let i = 0; i < sp.length; i++) {
      const p = sp[i];
      const q = sp[(i + 1) % sp.length];
      if ((p[1] <= yc && q[1] > yc) || (q[1] <= yc && p[1] > yc))
        xs.push(p[0] + ((yc - p[1]) / (q[1] - p[1])) * (q[0] - p[0]));
    }
    xs.sort((m, n) => m - n);
    for (let k = 0; k + 1 < xs.length; k += 2)
      for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++)
        putImage(x, y, paint(c, x / RES, y / RES), a);
  }
}
/** a ring on a tilted plane: half 0 draws all of it, -1 the far half, 1 the near half */
export function ellipseRing(x: number, y: number, rx: number, ry: number, c: Color, a = 1, half = 0): void {
  const n = Math.max(8, Math.ceil(TAU * Math.max(rx, ry) * 1.3 * RES));
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU;
    const s = Math.sin(g);
    if (half && (s < 0 ? -1 : 1) !== half) continue;
    px(x + Math.cos(g) * rx, y + s * ry, c, a);
  }
}
export interface ShadeOut {
  c: Color;
  a: number;
}
const shadeOut: ShadeOut = { c: 0, a: 1 };
export interface ShadeOptions {
  /** blend out.c by out.a; otherwise out.a dithers */
  soft?: boolean;
  /** one sample per art pixel, filling its block: for soft, wide fills that need no fine edge */
  coarse?: boolean;
}
/** per-pixel shader over a local box: fn(x, y, out) sets out.c and out.a for pixel centers, in local art pixels */
export function shade(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  fn: (x: number, y: number, out: ShadeOut) => void,
  o: ShadeOptions = {},
): void {
  const step = o.coarse ? RES : 1;
  const a = toScreenX(x0) * RES;
  const b = toScreenX(x1) * RES;
  const snap = (v: number) => Math.floor(v / step) * step;
  const ix0 = Math.max(0, snap(Math.min(a, b)));
  const ix1 = Math.min(FW - 1, Math.ceil(Math.max(a, b)));
  const iy0 = Math.max(0, snap(toScreenY(y0) * RES));
  const iy1 = Math.min(FH - 1, Math.ceil(toScreenY(y1) * RES));
  const half = (step - 1) / 2;
  for (let iy = iy0; iy <= iy1; iy += step)
    for (let ix = ix0; ix <= ix1; ix += step) {
      shadeOut.c = 0;
      shadeOut.a = 1;
      fn(localX(ix + half), localY(iy + half), shadeOut);
      if (!shadeOut.c) continue;
      for (let v = 0; v < step; v++)
        for (let u = 0; u < step; u++) {
          if (o.soft) blendImage(ix + u, iy + v, shadeOut.c, shadeOut.a);
          else putImage(ix + u, iy + v, shadeOut.c, shadeOut.a);
        }
    }
}

// ---- light
/** the art rows any light fell on this frame, inclusive */
const litRows = { top: H, bottom: -1 };
function markLit(top: number, bottom: number): void {
  if (top < litRows.top) litRows.top = top;
  if (bottom > litRows.bottom) litRows.bottom = bottom;
}
/** a glow's falloff by squared distance over squared radius: (1 - sqrt(d)) squared, read from a table */
const FALLOFF_STEPS = 1024;
const FALLOFF = Float32Array.from({ length: FALLOFF_STEPS + 1 }, (_, i) => (1 - Math.sqrt(i / FALLOFF_STEPS)) ** 2);
/** radial glow: k at the center, falling to 0 at radius r */
export function glow(x: number, y: number, r: number, c: Color, k = 0.5): void {
  if (r < 1 || k <= 0.004) return;
  const cx = toScreenX(x);
  const cy = toScreenY(y);
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(W - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(H - 1, Math.ceil(cy + r));
  if (x1 < x0 || y1 < y0) return;
  markLit(y0, y1);
  const ir = 1 / r;
  const rr = cr(c) * k;
  const gg = cg(c) * k;
  const bb = cb(c) * k;
  for (let sy = y0; sy <= y1; sy++) {
    const dy = (sy + 0.5 - cy) * ir;
    const dy2 = dy * dy;
    if (dy2 >= 1) continue;
    const row = sy * W;
    for (let sx = x0; sx <= x1; sx++) {
      const dx = (sx + 0.5 - cx) * ir;
      const d = dx * dx + dy2;
      if (d >= 1) continue;
      const w = FALLOFF[(d * FALLOFF_STEPS) | 0];
      const i = row + sx;
      lightR[i] += rr * w;
      lightG[i] += gg * w;
      lightB[i] += bb * w;
    }
  }
}
/** a soft beam of light around a segment */
export function glowLine(x0: number, y0: number, x1: number, y1: number, r: number, c: Color, k = 0.5): void {
  if (r < 1 || k <= 0.004) return;
  const ax = toScreenX(x0);
  const ay = toScreenY(y0);
  const dx = toScreenX(x1) - ax;
  const dy = toScreenY(y1) - ay;
  const X0 = Math.max(0, Math.floor(Math.min(ax, ax + dx) - r));
  const X1 = Math.min(W - 1, Math.ceil(Math.max(ax, ax + dx) + r));
  const Y0 = Math.max(0, Math.floor(Math.min(ay, ay + dy) - r));
  const Y1 = Math.min(H - 1, Math.ceil(Math.max(ay, ay + dy) + r));
  if (X1 < X0 || Y1 < Y0) return;
  markLit(Y0, Y1);
  const inv = 1 / (dx * dx + dy * dy || 1e-9);
  const ir2 = 1 / (r * r);
  const rr = cr(c) * k;
  const gg = cg(c) * k;
  const bb = cb(c) * k;
  for (let sy = Y0; sy <= Y1; sy++) {
    const qy = sy + 0.5 - ay;
    const row = sy * W;
    for (let sx = X0; sx <= X1; sx++) {
      const qx = sx + 0.5 - ax;
      const u = clamp((qx * dx + qy * dy) * inv);
      const ex = qx - dx * u;
      const ey = qy - dy * u;
      const d = (ex * ex + ey * ey) * ir2;
      if (d >= 1) continue;
      const f = FALLOFF[(d * FALLOFF_STEPS) | 0];
      const i = row + sx;
      lightR[i] += rr * f;
      lightG[i] += gg * f;
      lightB[i] += bb * f;
    }
  }
}
/** a four-point star glint */
export function sparkle(x: number, y: number, arm: number, c: Color, tip: Color, k = 0.5): void {
  if (arm < 0.6) return;
  const n = Math.round(arm);
  px(x, y, WHITE);
  // the arms start an art pixel wide and run out to single image pixels at the tips
  for (let d = 1; d <= n; d++) {
    const col = d <= n * 0.5 ? c : tip;
    const a = d === n ? 0.6 : 1;
    const dot =
      d <= n * 0.5 ? px : (fx: number, fy: number, fc: Color, fa: number) => fleck(fx + 0.25, fy + 0.25, fc, fa);
    dot(x + d, y, col, a);
    dot(x - d, y, col, a);
    dot(x, y + d, col, a);
    dot(x, y - d, col, a);
  }
  if (arm > 3)
    for (const [dx, dy] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ])
      px(x + dx, y + dy, tip, 0.6);
  glow(x, y, arm * 2 + 3, c, k);
}

/** start a frame from the background, an image the size of the frame, shifted by the shake */
export function beginFrame(background: Uint32Array): void {
  const [sx, sy] = shakeOffset();
  if (sx === 0 && sy === 0) color.set(background);
  else {
    const dx = sx * RES;
    const lead = Math.max(0, dx);
    const from = Math.max(0, -dx);
    const span = FW - Math.abs(dx);
    for (let iy = 0; iy < FH; iy++) {
      const row = clamp(iy - sy * RES, 0, FH - 1) * FW;
      const first = iy * FW;
      color.set(background.subarray(row + from, row + from + span), first + lead);
      // the strip the shake uncovers repeats the picture's edge
      if (dx > 0) color.fill(background[row], first, first + lead);
      else if (dx < 0) color.fill(background[row + FW - 1], first + span, first + FW);
    }
  }
  if (litRows.bottom >= 0) {
    const from = litRows.top * W;
    const to = (litRows.bottom + 1) * W;
    lightR.fill(0, from, to);
    lightG.fill(0, from, to);
    lightB.fill(0, from, to);
  }
  litRows.top = H;
  litRows.bottom = -1;
}
/**
 * How much a sum of light brightens a pixel: one for one while it is dim, then easing toward full white, so the heart
 * of a burst keeps its colour and its shape where a straight sum would flatten it to white.
 */
const TONE_KNEE = 96;
const TONE_SIZE = 2048;
const TONE = Uint8Array.from({ length: TONE_SIZE }, (_, l) =>
  l <= TONE_KNEE ? l : Math.round(TONE_KNEE + (255 - TONE_KNEE) * (1 - Math.exp(-(l - TONE_KNEE) / (255 - TONE_KNEE)))),
);
const toned = (l: number): number => TONE[l >= TONE_SIZE ? TONE_SIZE - 1 : l | 0];
const byte = (v: number): number => (v >= 255 ? 255 : v);
/** color plus light into RGBA bytes, with an optional flat cold flash; rows and pixels without light skip the sums */
export function composite(out: Uint8ClampedArray, flash: number): void {
  // little endian RGBA bytes read as one word are ABGR
  const out32 = new Uint32Array(out.buffer, out.byteOffset, FN);
  const fr = flash * 0.7;
  const fg = flash * 0.75;
  for (let iy = 0; iy < FH; iy++) {
    const ly = (iy / RES) | 0;
    const lit = flash > 0 || (ly >= litRows.top && ly <= litRows.bottom);
    const row = iy * FW;
    if (!lit) {
      for (let i = row, end = row + FW; i < end; i++) {
        const c = color[i];
        out32[i] = 0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >> 16) & 0xff);
      }
      continue;
    }
    for (let lx = 0, li = ly * W, i = row; lx < W; lx++, li++) {
      const sum = lightR[li] + lightG[li] + lightB[li] + flash;
      if (sum < 1) {
        for (let u = 0; u < RES; u++, i++) {
          const c = color[i];
          out32[i] = 0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >> 16) & 0xff);
        }
        continue;
      }
      const lr = toned(lightR[li] + fr);
      const lg = toned(lightG[li] + fg);
      const lb = toned(lightB[li] + flash);
      for (let u = 0; u < RES; u++, i++) {
        const c = color[i];
        const r = byte(((c >> 16) & 0xff) + lr);
        const g = byte(((c >> 8) & 0xff) + lg);
        const b = byte((c & 0xff) + lb);
        out32[i] = 0xff000000 | (b << 16) | (g << 8) | r;
      }
    }
  }
}
