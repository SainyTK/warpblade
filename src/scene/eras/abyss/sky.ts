import { H, W } from "../../../constants/stage";
import { bayerAt, glowLine, place } from "../../../engine/frame";
import { hex, mix, ramp } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { ridgeTopAt } from "../../terrain";

/** The abyss sky: a black sun with a burning corona, a rift torn across the sky, and void tendrils behind the ridge. */

export const SUN = { x: 246, y: 40, r: 14 } as const;
const CORONA = ramp(["#2a0814", "#4e0c20", "#7e1228", "#b8202e", "#ec4a34", "#ff9a5a"]);
const SUN_CORE = hex("#030105");
const SUN_RIM = hex("#ffc89a");
const TEAR = ramp(["#3a0c2a", "#7a1848", "#c02a6a", "#ff6aa0", "#ffe0f0"]);
const TENDRIL = hex("#0c050e");
const TENDRIL_RIM = hex("#2e0c22");

/** an eclipsed sun: a black disc, a thin hot rim and a ragged corona of rays */
function drawSun(bg: Uint32Array, r: Rng, k: number): void {
  const R = SUN.r + Math.round(k * 2);
  const rays = Array.from({ length: 24 }, () => r.range(0.3, 1));
  const reach = 12 + k * 8;
  for (let y = SUN.y - R - 26; y <= SUN.y + R + 26; y++)
    for (let x = SUN.x - R - 26; x <= SUN.x + R + 26; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const dx = x + 0.5 - SUN.x;
      const dy = y + 0.5 - SUN.y;
      const d = Math.hypot(dx, dy);
      const i = y * W + x;
      if (d <= R) bg[i] = SUN_CORE;
      else if (d <= R + 1) bg[i] = SUN_RIM;
      else {
        const a = ((Math.atan2(dy, dx) / (Math.PI * 2) + 1) % 1) * rays.length;
        const j = Math.floor(a);
        const f = a - j;
        const ray = rays[j] * (1 - f) + rays[(j + 1) % rays.length] * f;
        const u = 1 - (d - R - 1) / (reach * (0.45 + ray * 0.9));
        if (u <= 0) continue;
        const c = CORONA[Math.min(CORONA.length - 1, Math.floor(u * u * CORONA.length))];
        if (u > bayerAt(x, y) * 0.9) bg[i] = mix(bg[i], c, 0.55 + u * 0.45);
      }
    }
}

/** the points of the tear across the sky, longer as the era goes on */
export function tearPath(k: number, r: Rng): [number, number][] {
  const n = 4 + Math.round(k * 6);
  const pts: [number, number][] = [];
  let x = 118;
  let y = 22;
  for (let i = 0; i <= n; i++) {
    pts.push([x, y]);
    x -= r.range(7, 12);
    y += r.range(-2, 5);
  }
  return pts;
}

/** a jagged rift through the sky: a white hot seam with crimson lips that taper at both ends */
function drawTear(bg: Uint32Array, pts: readonly [number, number][]): void {
  const n = pts.length - 1;
  for (let s = 0; s < n; s++) {
    const [x0, y0] = pts[s];
    const [x1, y1] = pts[s + 1];
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5);
    for (let q = 0; q <= steps; q++) {
      const u = (s + q / steps) / n;
      const w = Math.sin(u * Math.PI) * 3.2 + 0.6;
      const cx = x0 + ((x1 - x0) * q) / steps;
      const cy = y0 + ((y1 - y0) * q) / steps;
      for (let oy = -Math.ceil(w) - 3; oy <= Math.ceil(w) + 3; oy++) {
        const px = Math.round(cx);
        const py = Math.round(cy + oy);
        if (px < 0 || py < 0 || px >= W || py >= H) continue;
        const d = Math.abs(oy) / w;
        const i = py * W + px;
        if (d < 0.25 && w > 1.5) bg[i] = TEAR[4];
        else if (d < 0.6) bg[i] = TEAR[3];
        else if (d < 1) bg[i] = TEAR[2];
        else if (d < 1.6) bg[i] = TEAR[1];
        else if (d < 2.4 && bayerAt(px, py) < 0.5) bg[i] = mix(bg[i], TEAR[0], 0.7);
      }
    }
  }
}

/** void tendrils rising behind the far ridge, more of them as the era goes on */
function drawTendrils(bg: Uint32Array, r: Rng, k: number): void {
  const n = 3 + Math.round(k * 6);
  for (let t = 0; t < n; t++) {
    const bx = r.range(10, W - 10);
    const top = r.range(78, 98) - k * 12;
    const base = ridgeTopAt(Math.round(bx)) + 2;
    const ph = r.range(0, 6);
    const amp = r.range(3, 7);
    for (let y = Math.floor(top); y < base; y++) {
      const u = (y - top) / (base - top);
      const cx = bx + Math.sin(u * 5 + ph) * amp * (1 - u * 0.6);
      const w = 0.6 + u * 2.6;
      for (let x = Math.floor(cx - w); x <= Math.ceil(cx + w); x++) {
        if (x < 0 || x >= W) continue;
        const edge = x > cx + w - 1;
        bg[y * W + x] = edge && u > 0.2 ? TENDRIL_RIM : TENDRIL;
      }
    }
  }
}

/** static: the black sun, the tear and the tendrils */
export function drawAbyssSky(bg: Uint32Array, r: Rng, k: number, tear: readonly [number, number][]): void {
  drawTendrils(bg, r, k);
  drawSun(bg, r, k);
  drawTear(bg, tear);
}

/** each frame: the corona breathes, and now and then the tear flares a soft red */
export function drawSkyLight(t: number, k: number, tear: readonly [number, number][]): void {
  place();
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.8);
  glowLine(SUN.x - 1, SUN.y, SUN.x + 1, SUN.y, SUN.r + 30, CORONA[3], 0.16 + breathe * 0.05);
  // two slow waves multiplied: a soft swell every several seconds, never a strobe
  const surge = Math.max(0, Math.sin(t * 0.55) * Math.sin(t * 1.7 + 1)) ** 3;
  const lit = 0.14 + 0.05 * Math.sin(t * 2.1) + surge * (0.22 + k * 0.08);
  for (let i = 0; i + 1 < tear.length; i++) {
    const [x0, y0] = tear[i];
    const [x1, y1] = tear[i + 1];
    glowLine(x0, y0, x1, y1, 14, TEAR[2], lit);
  }
}
