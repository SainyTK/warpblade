// The frame: a color buffer (opaque pixels, faded by a 4x4 Bayer dither or truly blended for smoke) and an additive
// light buffer composited on top. The two-buffer model and Bayer threshold follow Sprite Fusion's open-source pixel art
// VFX (https://www.spritefusion.com/pixel-art-vfx), MIT License, Copyright (c) 2026 Hugo Duprez.
import { H, N, W } from "../constants/stage";
import type { Alpha, Color, Paint } from "../types/color";
import { cb, cg, cr, mix, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";

export const color = new Uint32Array(N);
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
/** local to screen */
export const toScreenX = (x: number): number => placement.tx + x * placement.fx;
export const toScreenY = (y: number): number => placement.ty + y;

const paint = (c: Paint, u: number, v?: number): Color => (typeof c === "function" ? c(u, v) : c);
const alpha = (a: Alpha, u: number): number => (typeof a === "function" ? a(u) : a);

// ---- raw screen writes
export function putScreen(sx: number, sy: number, c: Color, a = 1): void {
  if (!c || a <= 0) return;
  if (a < 1 && a <= bayerAt(sx, sy)) return;
  if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
  color[sy * W + sx] = c;
}
export function blendScreen(sx: number, sy: number, c: Color, a: number): void {
  if (a <= 0.01 || sx < 0 || sy < 0 || sx >= W || sy >= H) return;
  const i = sy * W + sx;
  color[i] = mix(color[i], c, Math.min(1, a));
}
const cellX = (x: number): number => Math.floor(placement.tx + (Math.floor(x) + 0.5) * placement.fx);
const cellY = (y: number): number => Math.floor(placement.ty + Math.floor(y) + 0.5);

// ---- shapes, local coordinates
export function px(x: number, y: number, c: Color, a = 1): void {
  putScreen(cellX(x), cellY(y), c, a);
}
export function line(x0: number, y0: number, x1: number, y1: number, c: Paint, a: Alpha = 1): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 1.4));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    px(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, paint(c, u), alpha(a, u));
  }
}
function screenBox(x: number, y: number, r: number) {
  const cx = toScreenX(x);
  const cy = toScreenY(y);
  return {
    cx,
    cy,
    x0: Math.max(0, Math.floor(cx - r)),
    x1: Math.min(W - 1, Math.ceil(cx + r)),
    y0: Math.max(0, Math.floor(cy - r)),
    y1: Math.min(H - 1, Math.ceil(cy + r)),
  };
}
/** solid disc, dithered when a < 1 */
export function circle(x: number, y: number, r: number, c: Color, a = 1): void {
  const b = screenBox(x, y, r);
  for (let sy = b.y0; sy <= b.y1; sy++)
    for (let sx = b.x0; sx <= b.x1; sx++) {
      const dx = sx + 0.5 - b.cx;
      const dy = sy + 0.5 - b.cy;
      if (dx * dx + dy * dy <= r * r) putScreen(sx, sy, c, a);
    }
}
/** translucent disc for smoke, mist and vapour */
export function disc(x: number, y: number, r: number, c: Color, a: number): void {
  if (a <= 0.01) return;
  const b = screenBox(x, y, r);
  for (let sy = b.y0; sy <= b.y1; sy++)
    for (let sx = b.x0; sx <= b.x1; sx++) {
      const d = Math.hypot(sx + 0.5 - b.cx, sy + 0.5 - b.cy);
      if (d <= r) blendScreen(sx, sy, c, a * Math.min(1, (r - d) * 0.8 + 0.35));
    }
}
export function polygon(points: readonly (readonly [number, number])[], c: Paint, a = 1): void {
  const sp = points.map(([x, y]) => [toScreenX(x), toScreenY(y)] as const);
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const p of sp) {
    top = Math.min(top, p[1]);
    bottom = Math.max(bottom, p[1]);
  }
  for (let y = Math.max(0, Math.floor(top)); y <= Math.min(H - 1, Math.ceil(bottom)); y++) {
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
      for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) putScreen(x, y, paint(c, x, y), a);
  }
}
/** a ring on a tilted plane: half 0 draws all of it, -1 the far half, 1 the near half */
export function ellipseRing(x: number, y: number, rx: number, ry: number, c: Color, a = 1, half = 0): void {
  const n = Math.max(8, Math.ceil(TAU * Math.max(rx, ry) * 1.3));
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
/** per-pixel shader over a local box: fn(x, y, out) sets out.c and out.a for pixel centers */
export function shade(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  fn: (x: number, y: number, out: ShadeOut) => void,
): void {
  const a = toScreenX(x0);
  const b = toScreenX(x1);
  const sx0 = Math.max(0, Math.floor(Math.min(a, b)));
  const sx1 = Math.min(W - 1, Math.ceil(Math.max(a, b)));
  const sy0 = Math.max(0, Math.floor(toScreenY(y0)));
  const sy1 = Math.min(H - 1, Math.ceil(toScreenY(y1)));
  for (let sy = sy0; sy <= sy1; sy++)
    for (let sx = sx0; sx <= sx1; sx++) {
      shadeOut.c = 0;
      shadeOut.a = 1;
      fn((sx + 0.5 - placement.tx) * placement.fx, sy + 0.5 - placement.ty, shadeOut);
      if (shadeOut.c) putScreen(sx, sy, shadeOut.c, shadeOut.a);
    }
}

// ---- light
function addLight(i: number, r: number, g: number, b: number): void {
  lightR[i] += r;
  lightG[i] += g;
  lightB[i] += b;
}
/** radial glow: k at the center, falling to 0 at radius r */
export function glow(x: number, y: number, r: number, c: Color, k = 0.5): void {
  if (r < 1 || k <= 0.004) return;
  const b = screenBox(x, y, r);
  const ir = 1 / r;
  const rr = cr(c) * k;
  const gg = cg(c) * k;
  const bb = cb(c) * k;
  for (let sy = b.y0; sy <= b.y1; sy++) {
    const dy = (sy + 0.5 - b.cy) * ir;
    for (let sx = b.x0; sx <= b.x1; sx++) {
      const dx = (sx + 0.5 - b.cx) * ir;
      const d = dx * dx + dy * dy;
      if (d >= 1) continue;
      const f = 1 - Math.sqrt(d);
      const w = f * f;
      addLight(sy * W + sx, rr * w, gg * w, bb * w);
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
  const len2 = dx * dx + dy * dy || 1e-9;
  const rr = cr(c) * k;
  const gg = cg(c) * k;
  const bb = cb(c) * k;
  const X0 = Math.max(0, Math.floor(Math.min(ax, ax + dx) - r));
  const X1 = Math.min(W - 1, Math.ceil(Math.max(ax, ax + dx) + r));
  const Y0 = Math.max(0, Math.floor(Math.min(ay, ay + dy) - r));
  const Y1 = Math.min(H - 1, Math.ceil(Math.max(ay, ay + dy) + r));
  for (let sy = Y0; sy <= Y1; sy++)
    for (let sx = X0; sx <= X1; sx++) {
      const qx = sx + 0.5 - ax;
      const qy = sy + 0.5 - ay;
      const u = clamp((qx * dx + qy * dy) / len2);
      const d = Math.hypot(qx - dx * u, qy - dy * u) / r;
      if (d >= 1) continue;
      const f = (1 - d) * (1 - d);
      addLight(sy * W + sx, rr * f, gg * f, bb * f);
    }
}
/** a four-point star glint */
export function sparkle(x: number, y: number, arm: number, c: Color, tip: Color, k = 0.5): void {
  if (arm < 0.6) return;
  const n = Math.round(arm);
  px(x, y, WHITE);
  for (let d = 1; d <= n; d++) {
    const col = d <= n * 0.5 ? c : tip;
    const a = d === n ? 0.6 : 1;
    px(x + d, y, col, a);
    px(x - d, y, col, a);
    px(x, y + d, col, a);
    px(x, y - d, col, a);
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

/** start a frame from the background, shifted by the shake */
export function beginFrame(background: Uint32Array): void {
  const [sx, sy] = shakeOffset();
  for (let y = 0; y < H; y++) {
    const row = clamp(y - sy, 0, H - 1) * W;
    for (let x = 0; x < W; x++) color[y * W + x] = background[row + clamp(x - sx, 0, W - 1)];
  }
  lightR.fill(0);
  lightG.fill(0);
  lightB.fill(0);
}
/** color plus light into RGBA bytes, with an optional flat cold flash */
export function composite(out: Uint8ClampedArray, flash: number): void {
  for (let i = 0, j = 0; i < N; i++, j += 4) {
    const c = color[i];
    out[j] = cr(c) + lightR[i] + flash * 0.7;
    out[j + 1] = cg(c) + lightG[i] + flash * 0.75;
    out[j + 2] = cb(c) + lightB[i] + flash;
    out[j + 3] = 255;
  }
}
