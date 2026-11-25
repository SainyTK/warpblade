import { FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { smoothNoise } from "../../../scene/eras/day/noise";
import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color, Ramp } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, smooth } from "../../../utils/math";
import { inMouth, roofAt, windowAt } from "./halls";
import { SCENE_COLORS as SC } from "./palette";
import { BRIDGE, FALLS, FAR_HALLS, type Hall, NEAR_HALLS, STALACTITES } from "./structures";

const FAR_HAZE = 0.42;
const FAR_WINDOWS = 0.3;
const NEAR_WINDOWS = 0.22;
const VEIN_WIDTH = 0.011;
const BAND_ROWS = 9;

const stepped = (ramp: Ramp, v: number, threshold: number): Color => {
  const at = clamp(v) * (ramp.length - 1);
  const i = Math.floor(at);
  return ramp[Math.min(ramp.length - 1, at - i > threshold ? i + 1 : i)];
};

export function ceilingAt(x: number): number {
  let drip = 0;
  for (const s of STALACTITES) {
    const u = Math.abs(x - s.x) / s.half;
    if (u < 1) drip = Math.max(drip, s.length * (1 - u) ** 1.7);
  }
  return 8 + 8 * smoothNoise(x, 0, 26) + 4 * smoothNoise(x, 7, 9) + drip;
}

function skyColor(y: number, threshold: number, P: ScenePalette): Color {
  return stepped(P.sky, (y / GROUND) ** 1.25, threshold);
}

function rock(x: number, y: number, bottom: number, threshold: number): Color {
  const below = bottom - y;
  if (below < 0.5) return SC.rockLit[2];
  if (below < 1.5) return SC.rockLit[1];
  if (below < 3.5 && threshold > (below - 1.5) / 2) return SC.rockLit[0];
  const vein = Math.abs(smoothNoise(x, y * 1.6, 7) - 0.5);
  if (vein < VEIN_WIDTH && below > 3 && below < 16) return stepped(SC.vein, 1 - below / 30, threshold);
  const tone = smoothNoise(x + 40, y, 5) * 0.8 + grain(Math.floor(x * RES), Math.floor(y * RES)) * 0.2;
  return stepped(SC.rock, tone * 0.9 + clamp(1 - below / 14) * 0.25, threshold);
}

function fall(x: number, y: number, k: number, threshold: number): Color {
  for (const f of FALLS) {
    if (f.from > k) continue;
    const wobble = Math.sin(y * 0.21 + f.x) * 0.6;
    const u = Math.abs(x - f.x - wobble) / f.half;
    if (u >= 1) continue;
    const streak = (y * 0.7 + f.x * 3) % 7 < 1.2;
    if (u < 0.3 || (streak && u < 0.6)) return SC.fall[3];
    if (u < 0.65) return SC.fall[2];
    return threshold < 0.75 ? SC.fall[1] : SC.fall[0];
  }
  return 0;
}

function hallColor(h: Hall, x: number, y: number, roof: number, near: boolean, threshold: number): Color {
  const shades = near ? SC.nearHall : SC.farHall;
  const mouth = inMouth(h, x, y);
  if (mouth >= 0) return stepped(SC.fall, 0.35 + mouth * 0.65, threshold);
  const glint = windowAt(h, x, y, near ? NEAR_WINDOWS : FAR_WINDOWS);
  if (glint) return glint === 2 ? SC.window[near ? 2 : 1] : SC.window[near ? 1 : 0];
  if (y - roof < 1) return near ? SC.hallRim[0] : shades[3];
  if (x - h.x0 < 1 || h.x1 - x < 1) return shades[2];
  if (Math.floor(y - roof) % BAND_ROWS === BAND_ROWS - 1) return shades[0];
  const heat = smooth(roof, GROUND, y);
  const base = grain(Math.floor(x * RES), Math.floor(y * RES)) < 0.12 ? shades[0] : shades[1];
  if (heat * 0.7 > threshold + 0.25) return near ? SC.hallRim[0] : shades[3];
  return heat > threshold ? mix(base, shades[2], 0.5) : base;
}

function hallsAt(halls: readonly Hall[], x: number, y: number, near: boolean, threshold: number): Color {
  for (let i = halls.length - 1; i >= 0; i--) {
    const h = halls[i];
    const roof = roofAt(h, x);
    if (roof !== null && y >= roof) return hallColor(h, x, y, roof, near, threshold);
  }
  return 0;
}

function bridge(x: number, y: number): Color {
  const v = y - BRIDGE.y;
  if (v < 0 || v >= BRIDGE.depth) return 0;
  if (v < 1) return SC.hallRim[1];
  if (v >= BRIDGE.depth - 1) return SC.hallRim[0];
  const u = ((x % BRIDGE.panel) + BRIDGE.panel) % BRIDGE.panel;
  const rise = ((BRIDGE.depth - 1) * u) / BRIDGE.panel;
  if (Math.abs(v - rise) < 0.6 || Math.abs(v - (BRIDGE.depth - 1 - rise)) < 0.6 || u < 0.8) return SC.nearHall[2];
  return 0;
}

export function cavernAt(x: number, y: number, k: number, threshold: number, P: ScenePalette): Color {
  const ceiling = ceilingAt(x);
  if (y < ceiling) return rock(x, y, ceiling, threshold);
  const near = hallsAt(NEAR_HALLS, x, y, true, threshold);
  if (near) return near;
  const span = bridge(x, y);
  if (span) return span;
  const lava = fall(x, y, k, threshold);
  if (lava) return lava;
  const sky = skyColor(y, threshold, P);
  const far = hallsAt(FAR_HALLS, x, y, false, threshold);
  return far ? mix(far, sky, FAR_HAZE) : sky;
}

export function paintCavern(paint: PlatePaint, k: number, P: ScenePalette): void {
  for (let iy = 0; iy < GROUND * RES; iy++)
    for (let ix = 0; ix < FW; ix++)
      paint.plate[iy * FW + ix] = cavernAt((ix + 0.5) / RES, (iy + 0.5) / RES, k, bayerAt(ix, iy), P);
}
