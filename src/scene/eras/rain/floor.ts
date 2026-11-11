import { WORLD_COLORS as WC } from "../../../constants/palette";
import { BRAZIERS, FH, FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { noise } from "./noise";
import { RAIN_COLORS as RC } from "./palette";
import { PUDDLES } from "./puddles";

/**
 * The wet floor: a bright broken sheen along its lip, the skyline mirrored and squashed in the film of water on its
 * top course, warm streaks under the braziers, standing puddles that mirror more clearly, and water running down
 * its face.
 */

const FLOOR = [LAYER.ground] as const;
/** the floor's top image row */
const TOP = GROUND * RES;
/** the mirror on the wet top course: its depth in image rows, image rows of scene per row of mirror, and its strength */
const MIRROR = { depth: 17, squash: 5, most: 0.85, lift: 0.18 };
/** the brazier's light on the floor below it: half width in image pixels and strength */
const WARM = { half: 9, most: 0.34 };
/** a puddle: depth in image rows, image rows of scene per row of mirror, how much of it is mirror, its glint's row */
const POOL = { depth: 6, squash: 4, mirror: 0.6, glint: 2 };
/** how dark the damp face is, and the runnels of water down it: chance per column, length range in image rows */
const FACE = { damp: 0.9, chance: 0.07, length: [4, 14], pale: 0.2 } as const;
const SHEEN = { cell: 5, share: 0.42, most: 0.75 };

/** the broken wet sheen along the lip: runs of pale glints with gaps between */
function sheen(paint: PlatePaint): void {
  for (let ix = 0; ix < FW; ix++) {
    const run = grain(Math.floor(ix / SHEEN.cell), 71);
    if (run > SHEEN.share) continue;
    paint.blend(ix, TOP, RC.sheen, SHEEN.most * (0.5 + grain(ix, 5) * 0.5), FLOOR);
  }
}

/** the scene above the floor mirrored into its top course, rippled row by row and fading with depth */
function mirror(paint: PlatePaint): void {
  for (let d = 1; d <= MIRROR.depth; d++) {
    const iy = TOP + d;
    const fade = (1 - d / (MIRROR.depth + 1)) ** 1.6;
    const ripple = Math.round(Math.sin(d * 1.9) * 1.5);
    for (let ix = 0; ix < FW; ix++) {
      // ripples break the mirror into dashes, more of them deeper down
      if (noise(ix / 7 + d * 3.3, d * 0.9) < 0.15 + (1 - fade) * 0.35) continue;
      const seen = paint.get(ix + ripple, TOP - 1 - d * MIRROR.squash);
      if (!seen) continue;
      paint.blend(ix, iy, mix(seen, RC.sheen, MIRROR.lift), MIRROR.most * fade, FLOOR);
    }
  }
}

/** a streak of the brazier's fire in the wet floor under each one */
function warmth(paint: PlatePaint, strength: number): void {
  for (const b of BRAZIERS)
    for (let d = 0; d <= MIRROR.depth; d++) {
      const fade = 1 - d / (MIRROR.depth + 1);
      for (let o = -WARM.half; o <= WARM.half; o++) {
        const ix = b.x * RES + o;
        const across = 1 - Math.abs(o) / (WARM.half + 1);
        if (across * fade < bayerAt(ix, TOP + d) * 0.8) continue;
        paint.blend(ix, TOP + d, WC.brazierGlow, WARM.most * strength * across * fade, FLOOR);
      }
    }
}

/** standing water on the floor: a bright near lip, a clear mirror of what stands above, a dark far rim */
function puddles(paint: PlatePaint): void {
  for (const [x0, w] of PUDDLES) {
    const mid = (x0 + w / 2) * RES;
    const half = (w / 2) * RES;
    for (let d = 0; d < POOL.depth; d++) {
      const iy = TOP + d;
      // an oval seen nearly edge on: widest a third of the way down
      const v = (d + 0.5) / POOL.depth;
      const reach = half * Math.sqrt(Math.max(0, 1 - (v * 1.5 - 0.5) ** 2));
      for (let ix = Math.ceil(mid - reach); ix <= mid + reach; ix++) {
        const rim = Math.abs(ix - mid) > reach - 1.5;
        const seen = paint.get(ix + (d & 1), TOP - 2 - d * POOL.squash) || RC.puddleSky;
        let c = mix(RC.puddle, mix(seen, RC.puddleSky, 0.3), POOL.mirror);
        if (d === 0) c = grain(ix >> 1, 9) < 0.7 ? RC.puddleLip : c;
        else if (d === POOL.glint && grain(ix >> 2, 13) < 0.5) c = RC.puddleSky;
        else if (rim && v > 0.5) c = scale(RC.puddle, 0.7);
        paint.put(ix, iy, c, FLOOR);
      }
    }
  }
}

/** the face under the lip: damp and dark, with thin runnels of water catching the light */
function face(paint: PlatePaint, r: Rng): void {
  for (let iy = TOP + MIRROR.depth + 1; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) paint.put(ix, iy, scale(paint.get(ix, iy), FACE.damp), FLOOR);
  for (let ix = 0; ix < FW; ix++) {
    if (!r.chance(FACE.chance)) continue;
    const from = TOP + r.int(2, 60);
    const length = r.int(FACE.length[0], FACE.length[1]);
    for (let iy = from; iy < Math.min(FH, from + length); iy++)
      paint.blend(ix, iy, RC.sheen, FACE.pale * (1 - (iy - from) / length), FLOOR);
  }
}

/** paint the wet floor; `braziers` is how strongly the fires burn */
export function paintFloor(paint: PlatePaint, r: Rng, braziers: number): void {
  face(paint, r);
  mirror(paint);
  warmth(paint, braziers);
  puddles(paint);
  sheen(paint);
}
