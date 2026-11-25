import { FW, GROUND, RES, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { fbm } from "./noise";
import { SKYWAY_COLORS as S } from "./palette";
import { type Billow, cloudLight, fieldAt, rampDither, SKY_ROWS } from "./picture";

export const SEA_TOP = 116;
export const SEA_POCKETS: readonly Billow[] = [
  { x: 40, y: 140, r: 18 },
  { x: 150, y: 146, r: 16 },
  { x: 300, y: 138, r: 20 },
];

function billows(r: Rng): Billow[] {
  const out: Billow[] = [];
  for (const [row, size, shift] of [
    [SEA_TOP + 10, 9, 0],
    [SEA_TOP + 22, 12, 6],
    [SEA_TOP + 34, 14, 2],
  ] as const) {
    for (let x = -10 + shift; x <= W + 10; x += size * 1.3) {
      out.push({ x: x + r.range(-3, 3), y: row + r.range(-3, 3), r: size + r.range(-2, 3) });
    }
  }
  return out;
}

function farBank(pic: Uint32Array): void {
  for (let iy = 84 * RES; iy < SEA_TOP * RES + 20; iy++) {
    const y = iy / RES;
    for (let ix = 0; ix < FW; ix++) {
      const x = ix / RES;
      const top = 100 + Math.sin(x * 0.045) * 7 + Math.sin(x * 0.11 + 2) * 4 + (fbm(x * 0.08, 1) - 0.5) * 6;
      if (y < top) continue;
      const k = 0.25 + 0.35 * (1 - smooth(top, top + 10, y)) + (fbm(x * 0.06, y * 0.1) - 0.5) * 0.2;
      pic[iy * FW + ix] = rampDither(S.cloudSea, k * 0.7, ix, iy);
    }
  }
}

export function paintCloudSea(pic: Uint32Array, r: Rng): void {
  farBank(pic);
  const all = billows(r);
  for (let iy = (SEA_TOP - 4) * RES; iy < SKY_ROWS; iy++) {
    const y = iy / RES;
    for (let ix = 0; ix < FW; ix++) {
      const x = ix / RES;
      const texture = fbm(x * 0.1, y * 0.1);
      const h = fieldAt(all, x, y);
      const below = y > SEA_TOP + 34;
      const solid = h.f > 0.42 + (texture - 0.5) * 0.25;
      if (!solid && !below) continue;
      const depth = smooth(SEA_TOP, GROUND, y);
      const k = solid ? (cloudLight(h, 12) * 0.85 + (texture - 0.5) * 0.2) * (1 - depth * 0.5) : 0.25 - depth * 0.15;
      let c = rampDither(S.cloudSea, k, ix, iy);
      for (const p of SEA_POCKETS) {
        const d = Math.hypot(x - p.x, (y - p.y) * 1.6) / p.r;
        if (d >= 1) continue;
        const g = (1 - d) * (1 - d) * 0.45;
        if (g > bayerAt(ix, iy) * 0.5) c = mix(c, d < 0.3 ? S.boltEdge : S.stormGlow, g);
      }
      pic[iy * FW + ix] = c;
    }
  }
}
