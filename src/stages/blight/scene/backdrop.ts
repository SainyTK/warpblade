import { FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, smooth } from "../../../utils/math";
import { BLIGHT } from "../colors";
import type { SceneTones } from "./tones";

interface Trunk {
  x: number;
  w: number;
  haze: number;
}

const TRUNKS: readonly Trunk[] = [
  { x: 22, w: 14, haze: 0.62 },
  { x: 92, w: 10, haze: 0.66 },
  { x: 140, w: 18, haze: 0.6 },
  { x: 214, w: 12, haze: 0.64 },
  { x: 282, w: 16, haze: 0.62 },
  { x: 56, w: 26, haze: 0.38 },
  { x: 186, w: 30, haze: 0.34 },
  { x: 312, w: 22, haze: 0.4 },
];

const SHAFTS: readonly (readonly [number, number, number])[] = [
  [118, 9, 0.14],
  [204, 14, 0.18],
  [262, 7, 0.12],
];

export const FAR_GLOWS: readonly (readonly [number, number, number])[] = [
  [62, 74, 0],
  [50, 96, 1],
  [192, 58, 0],
  [180, 88, 1],
  [198, 104, 0],
  [314, 82, 1],
  [146, 70, 0],
  [28, 64, 1],
];

const FLOOR = GROUND * RES;

const canopyEdge = (x: number): number =>
  20 + Math.sin(x * 0.031) * 9 + Math.sin(x * 0.083 + 1) * 5 + Math.sin(x * 0.21 + 2) * 2;

const trunkCenter = (t: Trunk, y: number): number => t.x + Math.sin(y * 0.035 + t.x) * 2.5;

const trunkHalf = (t: Trunk, y: number): number => t.w / 2 + (Math.max(0, y - 118) / 38) ** 2 * t.w * 0.7;

function shaftLight(x: number, y: number): number {
  let k = 0;
  for (const [x0, w, a] of SHAFTS) {
    const d = Math.abs(x - (x0 - y * 0.45));
    if (d < w) k += a * (1 - d / w) * (1 - smooth(20, GROUND, y) * 0.7);
  }
  return k;
}

function trunkAt(x: number, y: number, threshold: number, P: ScenePalette, T: SceneTones): Color | 0 {
  const horizon = P.sky[P.sky.length - 1];
  for (let i = TRUNKS.length - 1; i >= 0; i--) {
    const t = TRUNKS[i];
    const half = trunkHalf(t, y);
    const u = x - trunkCenter(t, y);
    if (Math.abs(u) > half) continue;
    const across = u / half;
    const base = t.haze > 0.5 ? T.trunkFar : mix(T.trunkFar, T.trunkNear, 0.6);
    let c = across > 0.72 ? mix(base, T.trunkRim, 0.55) : across < -0.5 ? scale(base, 0.82) : base;
    const stripe = grain(Math.floor((x - t.x) * 1.2 + 40), Math.floor(y / 9));
    if (stripe > 0.78) c = scale(c, 0.86);
    const fog = t.haze * (0.55 + 0.45 * smooth(40, GROUND, y));
    const banded = Math.floor(fog * 6 + threshold) / 6;
    return mix(c, horizon, banded);
  }
  return 0;
}

const CANOPY_ROOTS: readonly (readonly [number, number, number, number])[] = [
  [3, 0.043, 0.2, 2.2],
  [8, 0.031, 1.7, 2.6],
  [12, 0.057, 3.1, 1.6],
  [16, 0.038, 4.4, 2],
  [21, 0.049, 5.2, 1.4],
  [26, 0.027, 0.9, 1.8],
];

function canopyAt(x: number, y: number, T: SceneTones): Color | 0 {
  const edge = canopyEdge(x);
  if (y > edge + 0.5) return 0;
  if (y > edge - 1) return T.canopyRim;
  for (const [base, freq, phase, thick] of CANOPY_ROOTS) {
    const centre = base + Math.sin(x * freq + phase) * 4 + Math.sin(x * freq * 2.7 + phase) * 1.5;
    const d = y - centre;
    if (Math.abs(d) < thick / 2)
      return d < -thick / 2 + 0.5 ? mix(T.canopy, T.canopyRim, 0.7) : mix(T.canopy, T.canopyRim, 0.3);
  }
  return T.canopy;
}

function strands(paint: PlatePaint, T: SceneTones): void {
  for (let i = 0; i < 46; i++) {
    const x = 3 + i * 7 + grain(i, 3) * 5;
    const top = canopyEdge(x);
    const len = 6 + grain(i, 9) * 48;
    const ix = Math.floor(x * RES);
    for (let iy = Math.floor(top * RES); iy < (top + len) * RES; iy++) {
      const sway = Math.round(Math.sin(iy * 0.05 + i) * 1.2);
      const fade = (iy / RES - top) / len;
      paint.blend(ix + sway, iy, T.canopy, 0.9 - fade * 0.5);
    }
    if (grain(i, 5) > 0.55) {
      const by = Math.floor((top + len) * RES);
      const sway = Math.round(Math.sin(by * 0.05 + i) * 1.2);
      const c = grain(i, 7) > 0.5 ? T.glowA : T.glowB;
      paint.put(ix + sway, by, c);
      paint.put(ix + sway + 1, by, mix(c, 0xffffff, 0.4));
      paint.put(ix + sway, by + 1, scale(c, 0.7));
      paint.put(ix + sway + 1, by + 1, c);
    }
  }
}

function farGlows(paint: PlatePaint, T: SceneTones): void {
  for (const [x, y, kind] of FAR_GLOWS) {
    const c = kind ? T.glowB : T.glowA;
    for (let k = 0; k < 4; k++) {
      const ix = Math.floor((x + k * 1.5 - 2) * RES);
      const iy = Math.floor((y - Math.abs(k - 1.5)) * RES);
      paint.put(ix, iy, c);
      paint.put(ix + 1, iy, mix(c, 0xffffff, 0.3));
      paint.put(ix, iy + 1, scale(c, 0.6));
      paint.put(ix + 1, iy + 1, scale(c, 0.6));
    }
  }
}

export function paintBackdrop(paint: PlatePaint, P: ScenePalette, T: SceneTones): void {
  for (let iy = 0; iy < FLOOR; iy++)
    for (let ix = 0; ix < FW; ix++) {
      const x = (ix + 0.5) / RES;
      const y = (iy + 0.5) / RES;
      const threshold = bayerAt(ix, iy);
      let c = paint.get(ix, iy);
      const trunk = trunkAt(x, y, threshold, P, T);
      if (trunk) c = trunk;
      const shaft = shaftLight(x, y);
      if (shaft > 0) c = mix(c, T.shaft, clamp(shaft + (threshold - 0.5) * 0.04));
      const canopy = canopyAt(x, y, T);
      if (canopy) c = canopy;
      paint.put(ix, iy, c);
    }
  strands(paint, T);
  farGlows(paint, T);
  for (let iy = FLOOR - 2 * RES; iy < FLOOR; iy++)
    for (let ix = 0; ix < FW; ix++) paint.blend(ix, iy, BLIGHT.rot[0], 0.25);
}
