import { FW, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { fbm } from "./noise";
import { SKYWAY_COLORS as S } from "./palette";
import { type Billow, cloudLight, fieldAt, rampDither, SKY_ROWS } from "./picture";

export const THUNDERHEAD = { x: 236, anvilTop: 15, anvilBase: 36, base: 118 } as const;
export const THUNDER_POCKETS: readonly Billow[] = [
  { x: 252, y: 66, r: 22 },
  { x: 214, y: 92, r: 16 },
  { x: 282, y: 34, r: 18 },
];

function billows(r: Rng): Billow[] {
  const out: Billow[] = [];
  for (let x = 130; x <= 350; x += 10) {
    const edge = 1 - Math.abs(x - THUNDERHEAD.x - 12) / 120;
    out.push({ x, y: 25 + r.range(-2, 2) + (1 - edge) * 6, r: r.range(9, 12) + edge * 3 });
  }
  for (let y = THUNDERHEAD.anvilBase; y <= THUNDERHEAD.base; y += 12) {
    const cx = THUNDERHEAD.x + Math.sin(y * 0.06) * 6;
    const half = 16 + (y - THUNDERHEAD.anvilBase) * 0.42;
    for (let x = cx - half; x <= cx + half; x += 15)
      out.push({ x: x + r.range(-4, 4), y: y + r.range(-3, 3), r: r.range(13, 19) });
  }
  return out;
}

export function paintThunderhead(pic: Uint32Array, r: Rng): void {
  const all = billows(r);
  const inside = new Uint8Array(FW * SKY_ROWS);
  for (let iy = THUNDERHEAD.anvilTop * RES; iy < THUNDERHEAD.base * RES + 30; iy++) {
    const y = iy / RES;
    for (let ix = 0; ix < FW; ix++) {
      const x = ix / RES;
      const texture = fbm(x * 0.08, y * 0.08);
      const h = fieldAt(all, x, y);
      if (h.f < 0.42 + (texture - 0.5) * 0.25 || y < THUNDERHEAD.anvilTop + (fbm(x * 0.05, 3) - 0.5) * 3) continue;
      inside[iy * FW + ix] = 1;
      const low = smooth(THUNDERHEAD.anvilBase, THUNDERHEAD.base, y);
      const shade = (cloudLight(h, 14) * 0.8 + (texture - 0.5) * 0.25 + 0.08) * (1 - 0.4 * low);
      let c = rampDither(S.thunder, shade, ix, iy);
      for (const p of THUNDER_POCKETS) {
        const d = Math.hypot(x - p.x, y - p.y) / p.r;
        if (d >= 1) continue;
        const k = (1 - d) * (1 - d) * 0.5;
        if (k > bayerAt(ix, iy) * 0.6) c = mix(c, d < 0.35 ? S.boltEdge : S.stormGlow, k);
      }
      pic[iy * FW + ix] = c;
    }
  }
  for (let iy = 1; iy < SKY_ROWS; iy++)
    for (let ix = 0; ix < FW - 2; ix++) {
      const i = iy * FW + ix;
      if (!inside[i] || inside[i - FW + 2]) continue;
      pic[i] = mix(pic[i], S.thunder[6], 0.6);
    }
}
