import { FH, FW, GROUND, RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { fbm } from "./noise";
import { SKYWAY_COLORS as S } from "./palette";
import { rampDither } from "./picture";

const TOP = GROUND * RES;
const D = S.deck;
export const ARCH = { period: 80, half: 29, crown: 13, spring: 24, pier: 5 } as const;
const STONE = { course: 4, block: 12, flag: 16, dentil: 6 } as const;

function archDistance(x: number, row: number): number {
  const local = (((x % ARCH.period) + ARCH.period) % ARCH.period) - ARCH.period / 2;
  return Math.hypot(local / ARCH.half, (row - ARCH.spring) / (ARCH.spring - ARCH.crown));
}

function deckTop(x: number, row: number, ix: number, iy: number): Color {
  if (row < 1) return grain(ix >> 1, 3) < 0.12 ? D[4] : D[5];
  if (row >= 5) return row < 6 ? D[4] : S.deckDeep;
  const joint = (x + (row > 2.5 ? 8 : 0)) % STONE.flag < 0.5;
  if (joint) return D[1];
  const lichen = fbm(x * 0.07, row * 0.4 + 3) > 0.64 && grain(ix, iy) > 0.35;
  if (lichen) return S.lichen[row < 2.5 ? 2 : 1];
  const tone = 0.62 - row * 0.05 + (grain(Math.floor(x / STONE.flag), 9) - 0.5) * 0.12 + (grain(ix, iy) - 0.5) * 0.08;
  return rampDither(D, tone, ix, iy);
}

function cornice(x: number, row: number, ix: number, iy: number): Color {
  if (row < 8) return rampDither(D, 0.42, ix, iy);
  const inDentil = x % STONE.dentil < 3.5;
  if (!inDentil) return S.deckDeep;
  return row < 9 ? D[3] : D[2];
}

function wall(x: number, row: number, ix: number, iy: number): Color {
  const d = archDistance(x, row);
  if (d < 1) return inside(x, row, ix, iy);
  if (d < 1.22) {
    const local = (((x % ARCH.period) + ARCH.period) % ARCH.period) - ARCH.period / 2;
    const angle = Math.atan2(ARCH.spring - row, local);
    const joint = Math.abs(((angle * 7) % 1) - 0.5) > 0.44;
    if (joint) return D[1];
    return d < 1.06 ? D[2] : rampDither(D, 0.62, ix, iy);
  }
  const pier = Math.abs(((((x + ARCH.period / 2) % ARCH.period) + ARCH.period) % ARCH.period) - ARCH.period / 2);
  const course = Math.floor((row - 10) / STONE.course);
  const brick = (x + (course % 2 ? STONE.block / 2 : 0)) % STONE.block;
  if ((row - 10) % STONE.course < 0.5 || brick < 0.5) return D[1];
  const shadow = clamp(1 - (row - 10) / 30);
  if (pier < ARCH.pier) {
    const lit = pier > ARCH.pier - 1.5 && x % ARCH.period < ARCH.period / 2 ? 0.75 : 0.55;
    return rampDither(D, lit * shadow + (grain(ix, iy) - 0.5) * 0.08, ix, iy);
  }
  const block = grain(Math.floor((x + (course % 2 ? 6 : 0)) / STONE.block), course + 20);
  return rampDither(D, (0.3 + block * 0.18) * (0.7 + shadow * 0.3) + (grain(ix, iy) - 0.5) * 0.08, ix, iy);
}

function inside(x: number, row: number, ix: number, iy: number): Color {
  const v = (row - ARCH.crown) / (ARCH.spring - ARCH.crown);
  const cloud = row > ARCH.spring - 4 + Math.sin(x * 0.4) * 1.2 + (fbm(x * 0.2, 2) - 0.5) * 2;
  if (cloud) return rampDither(S.cloudSea, 0.35 + fbm(x * 0.15, row * 0.3) * 0.25, ix, iy);
  const c = rampDither(S.abyss, 0.15 + v * 0.6, ix, iy);
  return fbm(x * 0.05, row * 0.2 + 7) > 0.66 ? mix(c, S.stormGlow, 0.25) : c;
}

export function bridgeColor(ix: number, iy: number): Color {
  const x = ix / RES;
  const row = (iy - TOP) / RES;
  if (row < 7) return deckTop(x, row, ix, iy);
  if (row < 10) return cornice(x, row, ix, iy);
  const c = wall(x, row, ix, iy);
  return row > 20 ? scale(c, 0.92) : c;
}

export function paintBridge(put: (i: number, c: Color) => void): void {
  for (let iy = TOP; iy < FH; iy++) for (let ix = 0; ix < FW; ix++) put(iy * FW + ix, bridgeColor(ix, iy));
}
