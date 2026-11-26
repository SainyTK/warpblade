import { FW, RES } from "../../../constants/stage";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { fbm } from "./noise";
import { SKYWAY_PALETTE as P, SKYWAY_COLORS as S } from "./palette";
import { rampDither, SKY_ROWS } from "./picture";

interface Isle {
  x: number;
  y: number;
  half: number;
  depth: number;
  haze: number;
  ruin: boolean;
  from: number;
  nest?: boolean;
}

export const ISLANDS: readonly Isle[] = [
  { x: 62, y: 70, half: 26, depth: 30, haze: 0.25, ruin: true, from: 0 },
  { x: 140, y: 96, half: 14, depth: 16, haze: 0.45, ruin: false, from: 0 },
  { x: 168, y: 46, half: 11, depth: 14, haze: 0.5, ruin: false, from: 0 },
  { x: 22, y: 36, half: 12, depth: 15, haze: 0.5, ruin: false, from: 0.5 },
  { x: 112, y: 30, half: 9, depth: 10, haze: 0.6, ruin: false, from: 0.5 },
  { x: 214, y: 108, half: 20, depth: 20, haze: 0.3, ruin: true, from: 0.5 },
  { x: 296, y: 64, half: 18, depth: 64, haze: 0.2, ruin: false, from: 1, nest: true },
];

function put(pic: Uint32Array, ix: number, iy: number, c: number, haze: number): void {
  if (ix < 0 || iy < 0 || ix >= FW || iy >= SKY_ROWS) return;
  const sky = P.sky[Math.min(P.sky.length - 1, Math.floor((iy / RES / 150) * P.sky.length))];
  pic[iy * FW + ix] = mix(c, sky, haze);
}

function rock(pic: Uint32Array, isle: Isle): void {
  const { x, y, half, depth, haze } = isle;
  for (let iy = Math.floor((y - 3) * RES); iy < (y + depth) * RES; iy++) {
    const v = iy / RES - y;
    for (let ix = Math.floor((x - half - 2) * RES); ix < (x + half + 2) * RES; ix++) {
      const u = (ix / RES - x) / half;
      const top = -1.6 * (1 - u * u) + (fbm(ix * 0.2, 5) - 0.5) * 1.2;
      const jag = (fbm(ix * 0.12, iy * 0.03) - 0.5) * 0.5;
      const reach = (1 - Math.abs(u) ** 1.4) * depth * (0.75 + jag);
      if (Math.abs(u) > 1 || v < top || v > reach) continue;
      const lit = clamp(0.5 + u * 0.45 - (v / depth) * 0.3 + (fbm(ix * 0.3, iy * 0.3) - 0.5) * 0.3);
      let c = rampDither(S.island, lit, ix, iy);
      if (v < top + 1.2) c = v < top + 0.6 ? S.islandGrass[2] : S.islandGrass[1];
      else if (Math.abs(u) > 0.92 - (v / depth) * 0.4 && u > 0) c = S.island[4];
      put(pic, ix, iy, c, haze);
    }
  }
  for (let k = 0; k < half / 3; k++) {
    const rx = x - half * 0.7 + k * 6 + fbm(k, 2) * 4;
    const ry = y + (1 - Math.abs((rx - x) / half) ** 1.4) * depth * 0.7;
    const len = 4 + fbm(k * 3, 7) * 8;
    for (let d = 0; d < len * RES; d++)
      put(pic, Math.floor(rx * RES + Math.sin(d * 0.3) * 1.2), Math.floor(ry * RES + d), S.island[1], haze);
  }
}

function ruin(pic: Uint32Array, isle: Isle): void {
  const base = isle.y - 1;
  for (const [px, tall] of [
    [isle.x - 10, 16],
    [isle.x + 4, 12],
  ] as const) {
    for (let iy = Math.floor((base - tall) * RES); iy < base * RES; iy++)
      for (let ix = Math.floor((px - 2) * RES); ix < (px + 2) * RES; ix++) {
        const rim = ix >= (px + 1.2) * RES;
        put(pic, ix, iy, rim ? S.island[4] : S.island[2], isle.haze);
      }
  }
  const cx = isle.x - 3;
  const top = base - 16;
  for (let a = 0; a < Math.PI; a += 0.02) {
    const ax = cx - Math.cos(a) * 7;
    const ay = top + 4 - Math.sin(a) * 5;
    if (ax > isle.x + 2) break;
    for (let w = 0; w < 3; w++) put(pic, Math.floor(ax * RES), Math.floor(ay * RES) + w, S.island[3], isle.haze);
  }
  for (let d = 0; d < 26 * RES; d++) {
    const bx = (isle.x + isle.half - 2) * RES + d;
    const sag = Math.sin((d / (26 * RES)) * Math.PI) * 2 * RES;
    for (let w = 0; w < 3; w++)
      put(pic, bx, Math.floor((isle.y + 1) * RES + sag + w), w === 0 ? S.island[4] : S.island[2], isle.haze);
  }
}

function nest(pic: Uint32Array, isle: Isle): void {
  for (let k = 0; k < 40; k++) {
    const a = fbm(k * 1.7, 3) * Math.PI - Math.PI / 2;
    const len = 6 + fbm(k, 9) * 10;
    const cx = isle.x + (fbm(k * 2.3, 1) - 0.5) * isle.half * 2.2;
    const cy = isle.y - 2 - fbm(k * 0.7, 4) * 5;
    for (let d = -len * RES; d < len * RES; d++) {
      const ix = Math.floor(cx * RES + Math.cos(a) * d * 0.5);
      const iy = Math.floor(cy * RES + Math.sin(a) * d * 0.25);
      put(pic, ix, iy, k % 3 === 0 ? S.island[4] : S.island[2], isle.haze);
    }
  }
}

export function paintIslands(pic: Uint32Array, k: number): void {
  for (const isle of ISLANDS) {
    if (k < isle.from) continue;
    rock(pic, isle);
    if (isle.ruin) ruin(pic, isle);
    if (isle.nest) nest(pic, isle);
  }
}
