import { H, MOON, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { hex, mix, ramp } from "../../../utils/color";
import { clamp } from "../../../utils/math";

/** the aurora's ribbons, top edge to the foot of the curtain */
const AURORA = [ramp(["#7af0d0", "#4ab8c8", "#5a4ab8"]), ramp(["#ff8ae8", "#a24ae0", "#4a2a9a"])];
const RING = hex("#d8c8ff");
const RING_DIM = hex("#7f6ac8");
const PLANET = ramp(["#2a4a86", "#3e86b8", "#7fd6ef", "#c8faff"]);
/** the second moon, a small teal world high left of the moon */
export const PLANET_AT = { x: 214, y: 20, r: 5 } as const;

/** floating rocks in the far sky: x, y, width, and the k at which each has drifted into view */
export const ISLANDS: readonly (readonly [number, number, number, number])[] = [
  [104, 22, 9, 0.25],
  [132, 50, 6, 0.5],
  [54, 62, 7, 0.5],
  [300, 74, 7, 0.75],
  [186, 40, 5, 1],
];

const put = (bg: Uint32Array, x: number, y: number, c: number, a = 1) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  if (a < 1 && a <= bayerAt(x, y)) return;
  bg[y * W + x] = c;
};

/** two ribbons of aurora hanging their curtains down the sky, fainter at the foot */
export function drawAurora(bg: Uint32Array, k: number): void {
  if (k <= 0) return;
  for (let b = 0; b < 2; b++) {
    const R = AURORA[b];
    for (let x = 0; x < W; x++) {
      const top = Math.round(26 + b * 18 + Math.sin(x * 0.028 + b * 2.3) * 9 + Math.sin(x * 0.011 + b) * 6);
      const L = 12 + Math.sin(x * 0.09 + b * 4) * 5 + k * 6;
      const sheen = 0.55 + 0.45 * Math.sin(x * 0.23 + b * 1.7);
      for (let d = 0; d < L; d++) {
        const u = d / L;
        const a = k * (1 - u) * sheen * 0.9;
        if (a <= bayerAt(x, top + d)) continue;
        const i = (top + d) * W + x;
        bg[i] = mix(bg[i], R[Math.min(2, Math.floor(u * 3))], 0.22 + 0.2 * k);
      }
    }
  }
}

/** a tilted ring around the moon: its far half hides behind the disc */
export function drawMoonRing(bg: Uint32Array, k: number): void {
  const a = clamp((k - 0.1) / 0.6);
  if (a <= 0) return;
  for (let s = 0; s < 360; s++) {
    const g = (s / 360) * Math.PI * 2;
    const x = Math.round(MOON.x + Math.cos(g) * 25);
    const y = Math.round(MOON.y + Math.sin(g) * 5 - Math.cos(g) * 6);
    if (Math.sin(g) < 0 && Math.hypot(x + 0.5 - MOON.x, y + 0.5 - MOON.y) <= MOON.r + 1) continue;
    put(bg, x, y, Math.sin(g) > 0 ? RING : RING_DIM, a);
  }
}

/** a second, smaller moon that rises in the later waves */
export function drawPlanet(bg: Uint32Array, k: number): void {
  if (k < 0.5) return;
  const { x: px0, y: py0 } = PLANET_AT;
  const r = PLANET_AT.r - 1 + (k - 0.5) * 2;
  for (let y = Math.floor(py0 - r - 1); y <= py0 + r + 1; y++)
    for (let x = Math.floor(px0 - r - 1); x <= px0 + r + 1; x++) {
      const d = Math.hypot(x + 0.5 - px0, y + 0.5 - py0);
      if (d > r + 1) continue;
      if (d > r) {
        put(bg, x, y, PLANET[0]);
        continue;
      }
      const lit = (x + 0.5 - px0 + (y + 0.5 - py0) * 0.4) / r;
      put(bg, x, y, PLANET[lit > 0.35 ? 3 : lit > -0.2 ? 2 : 1]);
    }
}

const ROCK = ramp(["#1e1636", "#2e2450", "#4a3c78", "#7c6cb4"]);

/** small rocks floating in the far sky, a crystal growing from each, moss lit cyan on top */
export function drawIslands(bg: Uint32Array, k: number): void {
  for (const [ix, iy, w, from] of ISLANDS) {
    if (k + 0.01 < from) continue;
    const h = Math.round(w * 0.8);
    for (let j = 0; j <= h; j++) {
      const half = (w / 2) * (1 - j / (h + 1)) ** 0.8;
      for (let x = Math.round(ix - half); x <= Math.round(ix + half); x++) {
        const c = j === 0 ? hex("#6ff0e0") : x >= ix + half - 1 ? ROCK[3] : j === 1 ? ROCK[2] : ROCK[1];
        put(bg, x, iy + j, c);
      }
    }
    put(bg, ix - 1, iy - 1, hex("#9a5ae0"));
    put(bg, ix - 1, iy - 2, hex("#d6a4ff"));
    put(bg, ix - 1, iy - 3, hex("#f6e4ff"));
    put(bg, ix, iy - 1, hex("#d6a4ff"));
    put(bg, ix + 2, iy - 1, hex("#5ee8f0"));
  }
}
