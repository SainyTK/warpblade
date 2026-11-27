import { hairline, line, polygon } from "../../../../engine/frame";
import { fineRing, ray } from "../../../../game/effects/fine";
import type { Color } from "../../../../types/color";
import { TAU } from "../../../../utils/math";
import { DAWN_RAMP } from "../../constants/light";

const KITE: readonly (readonly [number, number])[] = [
  [-0.8, -1],
  [0.8, -1],
  [0.92, -0.2],
  [0, 1.4],
  [-0.92, -0.2],
];

export function drawKite(x: number, y: number, s: number, tilt: number, fill: Color, a: number, emblem: boolean): void {
  const c = Math.cos(tilt);
  const n = Math.sin(tilt);
  const pts = KITE.map(([px, py]) => [x + (px * c - py * n) * s, y + (px * n + py * c) * s] as const);
  polygon(pts, fill, a * 0.8);
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    line(x0, y0, x1, y1, DAWN_RAMP[3], a);
  }
  if (!emblem) return;
  const ex = x - n * s * -0.25;
  const ey = y + c * s * -0.25;
  for (let i = 0; i < 5; i++) {
    const g = tilt - Math.PI / 2 + ((i - 2) / 4) * 1.6;
    ray(ex, ey, g, 0.5, s * 0.62, DAWN_RAMP[5], DAWN_RAMP[4], a);
  }
  hairline(x + n * s * 0.1, y - c * s * 0.1, x - n * s * 1.25, y + c * s * 1.25, DAWN_RAMP[4], a * 0.8);
}

export function drawSword(x: number, y: number, s: number, tilt: number, a: number): void {
  const c = Math.cos(tilt);
  const n = Math.sin(tilt);
  const at = (d: number, w = 0) => [x - n * d * s + c * w * s, y + c * d * s + n * w * s] as const;
  line(...at(-1.1), ...at(1.3), DAWN_RAMP[4], a);
  hairline(...at(-1), ...at(1.25), DAWN_RAMP[6], a * 0.7);
  line(...at(-0.75, -0.45), ...at(-0.75, 0.45), DAWN_RAMP[3], a);
  line(...at(-1.1), ...at(-1.45), DAWN_RAMP[2], a);
}

export function drawSun(x: number, y: number, s: number, spin: number, a: number): void {
  fineRing(x, y, s * 0.55, s * 0.55, DAWN_RAMP[4], a);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU + spin;
    ray(x, y, g, s * 0.7, s * (i % 2 ? 1.05 : 1.35), DAWN_RAMP[5], DAWN_RAMP[3], a);
  }
}

export function drawValorCrown(x: number, y: number, r: number, spin: number, a: number): void {
  const n = 10;
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU + spin;
    ray(x, y, g, r * 0.55, r * (i % 2 ? 0.85 : 1.1), DAWN_RAMP[4], DAWN_RAMP[2], a * 0.75);
  }
}

export function drawValorHalo(x: number, y: number, r: number, spin: number, a: number): void {
  fineRing(x, y, r, r * 0.32, DAWN_RAMP[4], a);
  for (let i = 0; i < 4; i++) {
    const g = (i / 4) * TAU + spin;
    const hx = x + Math.cos(g) * r;
    const hy = y + Math.sin(g) * r * 0.32;
    line(hx, hy - 1.5, hx, hy + 1.5, DAWN_RAMP[5], a);
    line(hx - 1.5, hy, hx + 1.5, hy, DAWN_RAMP[5], a);
  }
}
