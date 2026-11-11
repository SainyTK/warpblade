import { FW, GROUND, RES, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { clamp, smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import type { PlatePaint } from "../../platePaint";
import { skyBandAt } from "../../terrain";
import type { ScenePalette } from "../sceneDef";
import { banded } from "./brush";
import { NEBULA } from "./colors";
import { SUN_AT } from "./eclipse";
import { billow, cloud } from "./noise";

/** The abyss's open sky: its dark bands, dim clouds of void dust along the rift and the sun, and a few cold stars. */

/** the last image row of the sky that can show above the floor */
export const SKY_ROWS = GROUND * RES;
/** the clouds fade out over this many image pixels toward the stage's sides and top, where the world beyond has none */
const EDGE = { side: 70, top: 36 };
/** the clouds gather in a band at this height in art pixels, this deep, and thin out away from it */
const BAND = { y: 36, depth: 30, sway: 7 };
const DENSEST = 0.46;
/** the clouds are worked out once for each block of this many image pixels a side */
const SAMPLE = 4;
const STARS = { fine: 46, clearOfSun: 34 };

/** static: the sky's bands on every row above the floor, as the plate's own sky has them */
export function paintSkyBands(p: PlatePaint, P: ScenePalette): void {
  for (let iy = 0, i = 0; iy < SKY_ROWS; iy++) {
    for (let ix = 0; ix < FW; ix++, i++) {
      p.plate[i] = skyBandAt((iy + 0.5) / RES, bayerAt(ix, iy), P);
    }
  }
}

/** static: dim clouds of violet and crimson dust, thickest along the rift and around the sun */
export function paintNebula(p: PlatePaint): void {
  // the clouds are soft, so one sample every few image pixels is enough; only their banding is on the image grid
  for (let iy = 0; iy < SKY_ROWS; iy += SAMPLE) {
    const y = iy / RES;
    for (let ix = 0; ix < FW; ix += SAMPLE) {
      const x = ix / RES;
      const edge = clamp(Math.min(ix, FW - 1 - ix) / EDGE.side) * clamp(iy / EDGE.top);
      if (edge <= 0) {
        continue;
      }
      const off = (y - BAND.y - Math.sin(x * 0.02) * BAND.sway) / BAND.depth;
      const band = 0.2 + 0.8 * Math.exp(-off * off);
      const dense = smooth(0.4, 0.78, billow(ix, iy, 120, 11)) * band * edge;
      if (dense < 0.03) {
        continue;
      }
      const nearSun = clamp(1 - Math.hypot(x - SUN_AT.x, y - SUN_AT.y) / 90);
      const hue = mix(NEBULA.violet, NEBULA.crimson, clamp(cloud(ix, iy, 90, 20) * 1.4 - 0.2));
      const c = mix(hue, NEBULA.ember, nearSun * 0.6);
      for (let v = 0; v < SAMPLE; v++) {
        for (let u = 0; u < SAMPLE; u++) {
          p.blend(ix + u, iy + v, c, banded(dense * DENSEST, ix + u, iy + v, 7));
        }
      }
    }
  }
}

/** static: a few cold stars a single image pixel wide, none near the sun */
export function paintStars(p: PlatePaint, r: Rng, P: ScenePalette): void {
  for (let i = 0; i < STARS.fine; i++) {
    const x = r.range(2, W - 2);
    const y = r.range(2, 104);
    const bright = r.range(0.25, 1) * (1 - y / 140);
    if (Math.hypot(x - SUN_AT.x, y - SUN_AT.y) < STARS.clearOfSun) {
      continue;
    }
    const ix = Math.round(x * RES);
    const iy = Math.round(y * RES);
    p.put(ix, iy, mix(P.starDim, P.starBright, bright));
    if (bright > 0.62) {
      p.blend(ix + 1, iy, P.starBright, 0.35);
      p.blend(ix, iy + 1, P.starBright, 0.35);
      p.blend(ix - 1, iy, P.starBright, 0.35);
      p.blend(ix, iy - 1, P.starBright, 0.35);
    }
  }
}
