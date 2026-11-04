import { GROUND, H, MOON, N, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { hex, mix } from "../../../utils/color";
import { clamp, lerp } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";

/** The day sky's static parts: a haloed sun with soft rays, far blue mountains and puffy clouds lit from the sun's side. */

const NOON = {
  core: hex("#fffef4"),
  disc: hex("#fff6c8"),
  rim: hex("#ffe58a"),
  halo: hex("#fff3c4"),
  cloudLit: hex("#ffffff"),
  cloud: hex("#eef6fc"),
  cloudShade: hex("#d2e4f2"),
  cloudDeep: hex("#b4cfe6"),
  far: hex("#8fb2da"),
  farLit: hex("#a9c8e8"),
  farSnow: hex("#e6f2fa"),
};
const DUSK = {
  core: hex("#fffbe8"),
  disc: hex("#ffe6a0"),
  rim: hex("#ffc260"),
  halo: hex("#ffe0a8"),
  cloudLit: hex("#fff6e6"),
  cloud: hex("#f8e8dc"),
  cloudShade: hex("#e2cccc"),
  cloudDeep: hex("#c8b4c4"),
  far: hex("#9aa6cc"),
  farLit: hex("#c4b8cc"),
  farSnow: hex("#fbe8dc"),
};
export type SkyColors = typeof NOON;

/** the sky's own colors at progress k, warming from noon toward late afternoon */
export function skyColors(k: number): SkyColors {
  const u = k * 0.85;
  const out = { ...NOON };
  for (const key of Object.keys(NOON) as (keyof SkyColors)[]) out[key] = mix(NOON[key], DUSK[key], u);
  return out;
}

/** where the sun sits: the moon's place, sinking a little through the era */
export const sunAt = (k: number): { x: number; y: number; r: number } => ({
  x: MOON.x,
  y: MOON.y + Math.round(k * 10),
  r: MOON.r - 3,
});

/** a bright sun with a ring, a dithered halo and twelve soft rays that fade out across the sky */
export function drawSun(bg: Uint32Array, k: number, C: SkyColors): void {
  const { x: sx, y: sy, r } = sunAt(k);
  const R = 48;
  for (let y = Math.max(0, sy - R); y <= Math.min(H - 1, sy + R); y++)
    for (let x = Math.max(0, sx - R); x <= Math.min(W - 1, sx + R); x++) {
      const dx = x + 0.5 - sx;
      const dy = y + 0.5 - sy;
      const d = Math.hypot(dx, dy);
      const i = y * W + x;
      if (d <= r - 3) bg[i] = d < r * 0.45 ? C.core : C.disc;
      else if (d <= r - 1) bg[i] = C.disc;
      else if (d <= r) bg[i] = C.rim;
      else {
        const a = Math.atan2(dy, dx);
        const ray = Math.max(0, Math.cos(a * 6 + 0.4)) ** 14;
        const halo = d < r + 9 ? ((r + 9 - d) / 9) * 0.8 : 0;
        const beam = ray * clamp(1 - (d - r) / (R - r)) ** 1.5 * 0.6;
        const v = Math.max(halo, beam);
        if (v > bayerAt(x, y)) bg[i] = mix(bg[i], C.halo, d < r + 4 ? 0.8 : 0.4);
      }
    }
}

/** a soft range of far mountains behind the ridge, lit on their sunward slopes, with pale caps */
export function drawFarMountains(bg: Uint32Array, C: SkyColors): void {
  const peakAt = (x: number) =>
    96 - Math.abs(Math.sin(x * 0.018 + 0.6)) * 16 - Math.sin(x * 0.047 + 2.1) * 5 - Math.sin(x * 0.11) * 1.5;
  for (let x = 0; x < W; x++) {
    const top = Math.floor(peakAt(x));
    const slope = peakAt(x + 1) - peakAt(x - 1);
    for (let y = top; y < 122; y++) {
      const i = y * W + x;
      const depth = y - top;
      let c = slope < 0 ? C.farLit : C.far;
      if (depth < 3 && top < 86) c = depth === 0 || slope < 0 ? C.farSnow : C.farLit;
      // the foot of the range dissolves into the haze on the horizon
      const fade = clamp((y - 104) / 14);
      if (fade > bayerAt(x, y)) continue;
      bg[i] = c;
    }
  }
}

/** one puffy cloud built from round lumps over a flat base, lit from the upper right, shaded beneath */
export interface CloudShape {
  w: number;
  h: number;
  lumps: number[][];
}

export function cloudShape(w: number, h: number, r: Rng): CloudShape {
  const lumps: number[][] = [];
  const n = Math.max(3, Math.round(w / 9));
  for (let j = 0; j < n; j++) {
    const u = (j + 0.5) / n;
    const rad = lerp(h * 0.45, h * 0.95, Math.sin(u * Math.PI)) * r.range(0.8, 1.1);
    lumps.push([u * w, h - rad * 0.55, rad]);
  }
  return { w, h, lumps };
}

/** paint a cloud into a buffer: shade 0 is the lit top, 3 the deep underside */
export function paintCloud(
  put: (x: number, y: number, c: Color) => void,
  x0: number,
  y0: number,
  shape: CloudShape,
  C: SkyColors,
): void {
  const { w, h, lumps } = shape;
  for (let y = -h; y <= h; y++)
    for (let x = -4; x <= w + 4; x++) {
      if (y > h - 1) continue;
      let best = -1;
      let lit = 0;
      for (const [cx, cy, rad] of lumps) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        const q = 1 - Math.hypot(dx, dy) / rad;
        if (q > best) {
          best = q;
          lit = (dx * 0.6 - dy) / rad;
        }
      }
      if (best < 0) continue;
      const under = (y - (h - 4)) / 4;
      const sx = x0 + x;
      const sy = y0 + y;
      const b = bayerAt(sx, sy);
      let c: Color;
      if (under > b * 0.9) c = under > 0.6 + b * 0.4 ? C.cloudDeep : C.cloudShade;
      else if (best < 0.12 && lit < 0.2) c = C.cloudShade;
      else if (lit > 0.35 + b * 0.4) c = C.cloudLit;
      else c = C.cloud;
      put(sx, sy, c);
    }
}

/** a few big clouds high up, smaller ones lower, kept clear of the sun */
export function drawClouds(bg: Uint32Array, r: Rng, k: number, C: SkyColors): void {
  const sun = sunAt(k);
  const spots: readonly (readonly [number, number, number, number])[] = [
    [18, 26, 46, 10],
    [112, 16, 54, 12],
    [176, 48, 34, 8],
    [292, 70, 30, 7],
    [62, 66, 26, 6],
  ];
  const put = (x: number, y: number, c: Color) => {
    if (x >= 0 && y >= 0 && x < W && y < GROUND) bg[y * W + x] = c;
  };
  for (const [x, y, w, h] of spots) {
    if (Math.abs(x + w / 2 - sun.x) < w / 2 + 22 && Math.abs(y - sun.y) < 26) continue;
    paintCloud(put, x + r.int(-6, 6), y + r.int(-2, 2), cloudShape(w, h, r), C);
  }
}

/** the sky's pixels once the sky hook is done, to tell later which pixels of the finished background are open sky */
export const skySnapshot = new Uint32Array(N);
/** 1 where the finished background still shows the sky (or the far mountains), so drifting things stay behind the towers */
export const openSky = new Uint8Array(N);

export function markOpenSky(bg: Uint32Array): void {
  for (let i = 0; i < N; i++) openSky[i] = bg[i] === skySnapshot[i] && i < GROUND * W ? 1 : 0;
}
