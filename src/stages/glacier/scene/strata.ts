import { FH, FW, GROUND, RES } from "../../../constants/stage";
import { color, shakeOffset } from "../../../engine/frame";
import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { GLACIER as G } from "../colors";
import { dithered } from "./tone";

const SPAN = 640;
const STRIP = SPAN * RES;
const MID = { top: 92, parallax: 0.34 } as const;
const NEAR = { rows: 22, parallax: 0.72 } as const;
const MID_ROWS = (GROUND - MID.top) * RES;
const NEAR_ROWS = NEAR.rows * RES;
const BANK_RAMP = [G.ice[1], G.ice[2], G.ice[3], G.snow[0]];
const mid = new Uint32Array(MID_ROWS * STRIP);
const near = new Uint32Array(NEAR_ROWS * STRIP);

const wave = (x: number, n: number, phase = 0): number => Math.sin((x / SPAN) * TAU * n + phase);

const PILLARS = [34, 118, 196, 262, 342, 418, 488, 566, 612].map((x, i) => ({
  x,
  top: 98 + grain(i, 2) * 28,
  half: 5 + grain(i, 4) * 8,
  broken: grain(i, 6) > 0.6,
}));

const ICICLES = Array.from({ length: 30 }, (_, i) => ({
  x: i * (SPAN / 30) + grain(i, 9) * 12,
  len: 5 + grain(i, 11) ** 1.6 * 15,
  half: 1.6 + grain(i, 13) * 2.4,
}));

const bankY = (x: number): number => 140 + 4 * wave(x, 3) + 3 * wave(x, 7, 1) + 1.5 * wave(x, 17, 2);
const lipY = (x: number): number => 2.5 + 2 * wave(x, 4) + 1.5 * wave(x, 11, 0.6);

function pillarAt(x: number, y: number, bank: number, ix: number, iy: number): Color {
  for (const p of PILLARS) {
    const top = p.broken ? p.top + 6 : p.top;
    if (y < top - (p.broken ? 1.5 : 0) || y > bank + 2) continue;
    const u = p.broken ? 0.55 + 0.45 * ((y - top) / (bank - top)) : ((y - top) / (bank - top)) ** 0.75;
    const half = p.half * u + 0.4;
    const dx = x - p.x;
    if (Math.abs(dx) > half) continue;
    if (p.broken && y < top + 1) return G.snow[3];
    if (Math.abs(dx) > half - 0.8) return dx > 0 ? G.ice[5] : G.ice[1];
    if (Math.abs(dx - half * 0.15) < 0.5) return G.ice[3];
    return dx > half * 0.15 ? dithered(G.ice, 0.45 + (y - top) * 0.002, ix, iy) : G.ice[2];
  }
  return 0;
}

function midAt(x: number, y: number, ix: number, iy: number, haze: Color): Color {
  const bank = bankY(x);
  const pillar = pillarAt(x, y, bank, ix, iy);
  if (pillar) return mix(pillar, haze, 0.3);
  if (y < bank) return 0;
  const depth = y - bank;
  const ridge = (depth + 1.5 * wave(x, 9, 0.4)) % 8;
  let c: Color;
  if (depth < 0.6) c = G.snow[3];
  else if (depth < 1.6) c = G.snow[1];
  else if (ridge < 0.5 && depth < 12) c = mix(G.ice[3], G.snow[0], 0.5);
  else c = dithered(BANK_RAMP, 0.85 - depth * 0.05, ix, iy);
  return mix(c, haze, 0.22);
}

function nearAt(x: number, y: number): Color {
  const lip = lipY(x);
  if (y < lip - 0.6) return G.cave[1];
  if (y < lip) return G.ice[3];
  for (const s of ICICLES) {
    const u = (y - lip) / s.len;
    if (u > 1) continue;
    const half = s.half * (1 - u) ** 1.2;
    const dx = x - s.x;
    if (Math.abs(dx) > half) continue;
    if (u > 0.82) return G.ice[6];
    if (dx > half - 0.7) return G.ice[4];
    if (dx < -half + 0.6) return G.outline;
    return G.ice[1];
  }
  return 0;
}

let builtFor: ScenePalette | null = null;

export function buildStrata(P: ScenePalette): void {
  if (builtFor === P) return;
  builtFor = P;
  const haze = P.sky[5];
  for (let iy = 0; iy < MID_ROWS; iy++)
    for (let ix = 0; ix < STRIP; ix++)
      mid[iy * STRIP + ix] = midAt((ix + 0.5) / RES, MID.top + (iy + 0.5) / RES, ix, iy + MID.top * RES, haze);
  for (let iy = 0; iy < NEAR_ROWS; iy++)
    for (let ix = 0; ix < STRIP; ix++) near[iy * STRIP + ix] = nearAt((ix + 0.5) / RES, (iy + 0.5) / RES);
}

function layer(
  strip: Uint32Array,
  rows: number,
  top: number,
  shift: number,
  backing: Uint32Array | null,
  sx: number,
  sy: number,
): void {
  for (let r = 0; r < rows; r++) {
    const iy = top + r;
    const dy = iy + sy;
    if (dy < 0 || dy >= FH) continue;
    const from = r * STRIP;
    for (let ix = 0, s = shift; ix < FW; ix++) {
      const dx = ix + sx;
      const c = strip[from + s];
      s++;
      if (s === STRIP) s = 0;
      if (dx < 0 || dx >= FW) continue;
      if (c) color[dy * FW + dx] = c;
      else if (backing) color[dy * FW + dx] = backing[iy * FW + ix];
    }
  }
}

const wrapShift = (cameraX: number, parallax: number): number =>
  ((Math.round(cameraX * RES * parallax) % STRIP) + STRIP) % STRIP;

export function drawStrata(cameraX: number, plate: Uint32Array): void {
  const [ax, ay] = shakeOffset();
  const sx = ax * RES;
  const sy = ay * RES;
  layer(mid, MID_ROWS, MID.top * RES, wrapShift(cameraX, MID.parallax), plate, sx, sy);
  layer(near, NEAR_ROWS, 0, wrapShift(cameraX, NEAR.parallax), null, sx, sy);
}
