import { FW, GROUND, RES, W } from "../../../constants/stage";
import { mix } from "../../../utils/color";
import { clamp, lerp, smooth } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { noise } from "./noise";
import { RAIN_COLORS as RC } from "./palette";

/** Far rain hanging from the clouds in slanted veils, and mist lying between the towers and over the far ridge. */

/** a veil falls behind the towers, over the sky and the ridge */
const VEIL_LAYERS = [LAYER.sky, LAYER.celestial, LAYER.ridge] as const;
const MIST_LAYERS = [LAYER.ridge, LAYER.tower] as const;
/** art pixels a veil drifts left for each one it falls, the way the near rain slants */
const SLANT = 0.32;
const VEIL = { fadeIn: 14, width: [26, 64], top: [58, 90], count: [3, 7], thin: 0.07, thick: 0.3 } as const;
/** the mist starts at this art row and is thickest at the floor */
const MIST = { top: 104, ridge: 0.5, tower: 0.26, across: 34, down: 5 } as const;

/** grey veils of rain under the banks, streaked along their fall, more and heavier as the storm builds */
export function paintVeils(paint: PlatePaint, r: Rng, k: number, P: ScenePalette): void {
  const tint = mix(P.sky[P.sky.length - 1], RC.dropFar, 0.6);
  const count = Math.round(lerp(VEIL.count[0], VEIL.count[1], k));
  for (let n = 0; n < count; n++) {
    const cx = r.range(0, W);
    const half = r.range(VEIL.width[0], VEIL.width[1]) / 2;
    const top = r.range(VEIL.top[0], VEIL.top[1]);
    const seed = r.range(0, 90);
    for (let iy = Math.floor(top * RES); iy < GROUND * RES; iy++) {
      const y = (iy + 0.5) / RES;
      const mid = cx - (y - top) * SLANT;
      const start = clamp((y - top) / VEIL.fadeIn);
      for (let ix = Math.max(0, Math.floor((mid - half) * RES)); ix < Math.min(FW, (mid + half) * RES); ix++) {
        const x = (ix + 0.5) / RES;
        const u = (x - mid) / half;
        // streaks run along the fall, so the noise is read in the slanted frame
        const streak = noise((x + y * SLANT) * 1.1 + seed, y / 46 + seed);
        const a = (1 - u * u) * start * lerp(VEIL.thin, VEIL.thick, streak * streak) * lerp(0.6, 1, k);
        paint.blend(ix, iy, tint, a, VEIL_LAYERS);
      }
    }
  }
}

/** wisps of mist that thicken toward the floor, hiding the feet of the towers and the foot of the ridge */
export function paintMist(paint: PlatePaint, P: ScenePalette): void {
  for (let iy = MIST.top * RES; iy < GROUND * RES; iy++) {
    const y = (iy + 0.5) / RES;
    const depth = smooth(MIST.top, GROUND, y);
    for (let ix = 0; ix < FW; ix++) {
      const layer = paint.layerAt(ix, iy);
      if (layer !== LAYER.ridge && layer !== LAYER.tower) continue;
      const x = (ix + 0.5) / RES;
      const wisp = smooth(0.25, 0.8, noise(x / MIST.across, y / MIST.down));
      const most = layer === LAYER.ridge ? MIST.ridge : MIST.tower;
      paint.blend(ix, iy, P.mist, depth * most * (0.35 + 0.65 * wisp), MIST_LAYERS);
    }
  }
}
