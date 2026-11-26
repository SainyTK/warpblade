import { clamp } from "../../../utils/math";

export const WINDOWS: readonly Window[] = [
  { x: 240, half: 6, top: 8, bottom: 52 },
  { x: 263, half: 7, top: 4, bottom: 52 },
  { x: 286, half: 6, top: 8, bottom: 52 },
];

const APEX = Math.sqrt(3);
const SLANT = -0.42;
const LENGTH = Math.hypot(SLANT, 1);
export const SHAFT_DIR = { x: SLANT / LENGTH, y: 1 / LENGTH } as const;
const SHAFT = { spread: 0.11, fade: 150, most: 0.3 } as const;

export interface Window {
  x: number;
  half: number;
  top: number;
  bottom: number;
}

export function insideWindow(w: Window, x: number, y: number): number {
  const u = Math.abs(x - w.x) / w.half;
  if (u >= 1 || y >= w.bottom) return -1;
  const spring = w.top + APEX * w.half;
  const roof = spring - 2 * w.half * Math.sqrt(1 - ((u + 1) / 2) ** 2);
  if (y < roof) return -1;
  return clamp((y - w.top) / (w.bottom - w.top));
}

export function shaftLight(x: number, y: number): number {
  let sum = 0;
  for (const w of WINDOWS) {
    const rx = x - w.x;
    const ry = y - w.bottom;
    const along = rx * SHAFT_DIR.x + ry * SHAFT_DIR.y;
    if (along < 0) continue;
    const across = Math.abs(rx * SHAFT_DIR.y - ry * SHAFT_DIR.x);
    const width = w.half + along * SHAFT.spread;
    if (across >= width) continue;
    const core = (1 - across / width) ** 1.6;
    sum += core * Math.exp(-along / SHAFT.fade) * SHAFT.most;
  }
  return Math.min(0.5, sum);
}
