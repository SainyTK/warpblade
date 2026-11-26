import { FW, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { fbm } from "./noise";
import { SKYWAY_PALETTE as P, SKYWAY_COLORS as S } from "./palette";
import { rampDither, SKY_ROWS } from "./picture";

const HORIZON = { from: 90, to: 140, most: 0.28 } as const;

export function paintSky(pic: Uint32Array, r: Rng, k: number): void {
  for (let iy = 0; iy < SKY_ROWS; iy++) {
    const y = iy / RES;
    const band = Math.min(1, y / 150);
    const glow = smooth(HORIZON.from, HORIZON.to, y) * HORIZON.most * (1 + k * 0.7);
    for (let ix = 0; ix < FW; ix++) {
      const x = ix / RES;
      let c = rampDither(P.sky, band, ix, iy);
      if (glow > 0 && glow * (0.6 + fbm(x * 0.03, y * 0.05) * 0.8) > bayerAt(ix, iy) * 0.5)
        c = mix(c, S.stormGlow, glow * 0.5);
      pic[iy * FW + ix] = c;
    }
  }
  for (let i = 0; i < 40; i++) {
    const ix = r.int(0, FW - 1);
    const iy = r.int(0, 60 * RES);
    pic[iy * FW + ix] = mix(P.starDim, P.starBright, r.range(0.2, 1));
  }
}
