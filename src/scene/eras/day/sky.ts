import { FH, FN, FW, GROUND, MOON, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { clamp, TAU } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { skyBandAt } from "../../terrain";
import type { ScenePalette } from "../sceneDef";
import { cloudShape, paintCloud } from "./clouds";
import type { SkyColors } from "./colors";
import { paintMountains } from "./mountains";

/** The day sky at image pixel detail: dithered bands, two mountain ranges, a haloed sun with rays, and puffy clouds. */

/** where the sun sits: the moon's place, sinking a little through the era */
export const sunAt = (k: number): { x: number; y: number; r: number } => ({
  x: MOON.x,
  y: MOON.y + Math.round(k * 10),
  r: MOON.r - 3,
});

/** the sun's light in the sky around it, in art pixels beyond its disc */
const SUN = {
  /** the bright halo hugging the disc */
  halo: 15,
  haloStrength: 0.8,
  /** the faint warmth spread wide over the sky */
  bloom: 78,
  bloomStrength: 0.34,
  rays: 16,
  longRay: 58,
  shortRay: 34,
  /** a ray's half width at the disc, as a share of the gap between two rays */
  rayWidth: 0.2,
  rayStrength: 0.42,
  /** the halo's light comes in this many steps, broken up by the image grid's dither */
  steps: 7,
};

function paintSun(sky: Uint32Array, k: number, C: SkyColors): void {
  const { x: sx, y: sy, r } = sunAt(k);
  const reach = r + SUN.bloom;
  const y1 = Math.min(GROUND * RES, Math.ceil((sy + reach) * RES));
  for (let iy = Math.max(0, Math.floor((sy - reach) * RES)); iy < y1; iy++)
    for (let ix = Math.max(0, Math.floor((sx - reach) * RES)); ix < FW; ix++) {
      const dx = (ix + 0.5) / RES - sx;
      const dy = (iy + 0.5) / RES - sy;
      const d = Math.hypot(dx, dy);
      if (d >= reach) continue;
      const i = iy * FW + ix;
      const b = bayerAt(ix, iy);
      if (d <= r) {
        const edge = d + (b - 0.5) * 1.6;
        sky[i] = edge < r * 0.5 ? C.core : edge < r - 1.4 ? C.disc : C.rim;
        continue;
      }
      const out = d - r;
      const bloom = (1 - out / SUN.bloom) ** 2 * SUN.bloomStrength;
      const halo = out < SUN.halo ? (1 - out / SUN.halo) ** 2 * SUN.haloStrength : 0;
      const turn = (Math.atan2(dy, dx) / TAU) * SUN.rays;
      const nearest = Math.round(turn);
      const length = nearest % 2 === 0 ? SUN.longRay : SUN.shortRay;
      const along = clamp(1 - out / length);
      const ray = Math.abs(turn - nearest) < SUN.rayWidth * along ? along * SUN.rayStrength : 0;
      const v = Math.floor(Math.min(0.92, Math.max(halo, ray) + bloom) * SUN.steps + b) / SUN.steps;
      if (v > 0) sky[i] = mix(sky[i], C.halo, Math.min(1, v));
    }
}

/** where the still clouds hang: x, y, width and height in art pixels; big ones high up, smaller ones lower */
const CLOUD_SPOTS: readonly (readonly [number, number, number, number])[] = [
  [18, 26, 46, 10],
  [112, 16, 54, 12],
  [176, 48, 34, 8],
  [292, 70, 30, 7],
  [62, 66, 26, 6],
];
/** a still cloud keeps this far from the sun */
const SUN_CLEARING = { x: 22, y: 26 };

function paintClouds(sky: Uint32Array, r: Rng, k: number, C: SkyColors): void {
  const sun = sunAt(k);
  const put = (ix: number, iy: number, c: Color): void => {
    if (ix >= 0 && iy >= 0 && ix < FW && iy < FH) sky[iy * FW + ix] = c;
  };
  for (const [x, y, w, h] of CLOUD_SPOTS) {
    if (Math.abs(x + w / 2 - sun.x) < w / 2 + SUN_CLEARING.x && Math.abs(y - sun.y) < SUN_CLEARING.y) continue;
    paintCloud(put, (x + r.int(-6, 6)) * RES, (y + r.int(-2, 2)) * RES, cloudShape(w, h, r), C);
  }
}

/** the whole sky as it would look with nothing in front of it, one color per image pixel */
export function paintSkyPicture(r: Rng, k: number, C: SkyColors, P: ScenePalette): Uint32Array {
  const sky = new Uint32Array(FN);
  for (let iy = 0; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) sky[iy * FW + ix] = skyBandAt((iy + 0.5) / RES, bayerAt(ix, iy), P);
  paintMountains(sky, C);
  paintSun(sky, k, C);
  paintClouds(sky, r, k, C);
  return sky;
}
