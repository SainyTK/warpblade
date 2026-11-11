import { FH, FW, MOON, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix, WHITE } from "../../../utils/color";
import { clamp, smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { skyBandAt } from "../../terrain";
import type { ScenePalette } from "../sceneDef";
import { STAR_BAND, STAR_FAINT, STAR_TINTS } from "./colors";
import { cloudNoise } from "./noise";

/** The night sky at image pixel detail: a faint milky band, and stars from dust to a few bright ones with rays. */

const SKY = [LAYER.sky, LAYER.celestial] as const;
/** the milky band runs from the upper left down to the right, in image pixels: a point on it, its slope, its half width */
const BAND = { x: 0, y: 14, slope: 0.36, half: 44, glow: 0.2 };
const COUNTS = { dust: 520, small: 110, bright: 16 };
/** stars thin out toward the horizon, gone below this row, and none sit in the moon's halo */
const HORIZON = 250;
const MOON_CLEAR = (MOON.r + 16) * RES;

/** a bright star, kept so the sky's twinkle can sit on it; x and y in art pixels */
export interface BrightStar {
  x: number;
  y: number;
  tint: Color;
}

/** how deep an image pixel lies in the milky band, from 0 at its edge to 1 on its spine */
function bandAt(ix: number, iy: number): number {
  const off = Math.abs(iy - (BAND.y + (ix - BAND.x) * BAND.slope)) / BAND.half;
  return off >= 1 ? 0 : (1 - off) * (1 - off);
}

/** the open sky again, without the art pixel stars and halo, with the milky band's glow */
function paintBase(paint: PlatePaint, P: ScenePalette): void {
  for (let iy = 0; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) {
      if (!paint.on(ix, iy, SKY)) continue;
      paint.put(ix, iy, skyBandAt((iy + 0.5) / RES, bayerAt(ix, iy), P));
      const band = bandAt(ix, iy);
      if (band > 0) paint.blend(ix, iy, STAR_BAND, band * BAND.glow * smooth(0.2, 0.75, cloudNoise(ix / 38, iy / 30)));
    }
}

/** a random place in the sky that suits a star, or undefined when the try lands on the moon, a tower or the low haze */
function starPlace(paint: PlatePaint, r: Rng, crowd: number): [number, number] | undefined {
  const ix = r.int(1, FW - 2);
  const iy = r.int(1, HORIZON);
  const keep = (1 - iy / HORIZON) * (1 - crowd + crowd * bandAt(ix, iy) * 2.2);
  if (r.next() > keep) return undefined;
  if (Math.hypot(ix - MOON.x * RES, iy - MOON.y * RES) < MOON_CLEAR) return undefined;
  return paint.on(ix, iy, SKY) ? [ix, iy] : undefined;
}

/** paint the sky and its stars, and return the bright ones */
export function paintSky(paint: PlatePaint, r: Rng, P: ScenePalette): BrightStar[] {
  paintBase(paint, P);
  // star dust is a single image pixel, thickest along the milky band
  for (let i = 0; i < COUNTS.dust; i++) {
    const at = starPlace(paint, r, 0.7);
    const shine = r.range(0.25, 0.8);
    if (at) paint.blend(at[0], at[1], STAR_FAINT, shine, SKY);
  }
  for (let i = 0; i < COUNTS.small; i++) {
    const at = starPlace(paint, r, 0.35);
    const tint = r.pick(STAR_TINTS);
    const shine = r.range(0.45, 1);
    if (!at) continue;
    paint.blend(at[0], at[1], tint, shine, SKY);
    if (shine > 0.8) paint.blend(at[0] + 1, at[1], tint, 0.35, SKY);
  }
  const bright: BrightStar[] = [];
  for (let i = 0; i < COUNTS.bright; i++) {
    const at = starPlace(paint, r, 0);
    const tint = r.pick(STAR_TINTS);
    const rays = r.chance(0.4) ? 2 : 1;
    if (!at) continue;
    const [ix, iy] = at;
    paint.put(ix, iy, mix(tint, WHITE, 0.6), SKY);
    for (let d = 1; d <= rays; d++) {
      const a = clamp(0.7 / d);
      paint.blend(ix + d, iy, tint, a, SKY);
      paint.blend(ix - d, iy, tint, a, SKY);
      paint.blend(ix, iy + d, tint, a, SKY);
      paint.blend(ix, iy - d, tint, a, SKY);
    }
    bright.push({ x: (ix + 0.5) / RES, y: (iy + 0.5) / RES, tint });
  }
  return bright;
}
