import { WORLD_COLORS as WC } from "../../../constants/palette";
import { BRAZIERS, PLATFORMS, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { RAIN_COLORS as RC } from "./palette";

/**
 * The slabs in the rain: a wet sheen along each top, the brazier's fire caught in the wet stone around it, dark
 * water stains down the faces, beads of water under the edges, and sodden moss hanging from the ends.
 */

const SLAB = [LAYER.slab] as const;
/** below a slab is open air or a far layer; moss and beads never paint over the floor, a slab or a brazier */
const BEHIND = [LAYER.sky, LAYER.celestial, LAYER.ridge, LAYER.tower] as const;
/** a slab is this many image rows tall */
const DEPTH = 9 * RES;
const SHEEN = { cell: 4, share: 0.5, most: 0.8 };
const STAIN = { chance: 0.14, length: [4, 13], dark: 0.74 } as const;
const BEAD = { chance: 0.05 };
/** the fire's reach along the slab top in image pixels, and its strength */
const WARM = { reach: 26, most: 0.55 };
/** hanging moss at a slab's end: strands, their length range in image rows, how far in from the end they spread */
const MOSS = { strands: 9, length: [3, 15], spread: 16 } as const;

function sheen(paint: PlatePaint, x0: number, x1: number, top: number): void {
  for (let ix = x0; ix <= x1; ix++) {
    if (grain(Math.floor(ix / SHEEN.cell), top) > SHEEN.share) continue;
    paint.blend(ix, top, RC.sheen, SHEEN.most * (0.4 + grain(ix, top + 3) * 0.6), SLAB);
  }
}

/** dark runs of water from the lip down the face, each fading out in the dither */
function stains(paint: PlatePaint, r: Rng, x0: number, x1: number, top: number): void {
  for (let ix = x0 + 2; ix < x1 - 1; ix++) {
    if (!r.chance(STAIN.chance)) continue;
    const length = r.int(STAIN.length[0], STAIN.length[1]);
    for (let d = 0; d < length; d++) {
      const iy = top + 2 * RES + d;
      if (1 - d / length < bayerAt(ix, iy) * 0.6) continue;
      paint.put(ix, iy, scale(paint.get(ix, iy), STAIN.dark), SLAB);
    }
  }
}

/** beads of water hanging under the slab, about to fall */
function beads(paint: PlatePaint, r: Rng, x0: number, x1: number, top: number): void {
  for (let ix = x0 + 3; ix < x1 - 2; ix++) {
    if (!r.chance(BEAD.chance)) continue;
    paint.put(ix, top + DEPTH, RC.drop, BEHIND);
    if (r.chance(0.5)) paint.put(ix, top + DEPTH + 1, RC.sheen, BEHIND);
  }
}

/** a sodden clump of moss over one end of the slab: a cap on the lip and strands hanging past the underside */
function moss(paint: PlatePaint, r: Rng, end: number, inward: number, top: number, P: ScenePalette): void {
  for (let n = 0; n < MOSS.strands; n++) {
    const ix = end + inward * r.int(1, MOSS.spread);
    const length = r.int(MOSS.length[0], MOSS.length[1]);
    paint.put(ix, top - 1, P.mossTip);
    paint.put(ix, top, P.moss, SLAB);
    for (let d = 0; d < length; d++) {
      const c = d === length - 1 ? P.mossTip : d % 4 === 1 ? P.moss : P.vine;
      paint.put(ix, top + DEPTH + d, c, BEHIND);
    }
    if (r.chance(0.5)) paint.put(ix, top + DEPTH + length, RC.sheen, BEHIND);
  }
}

/** the brazier's fire in the wet slab top on either side of it */
function warmth(paint: PlatePaint, strength: number): void {
  for (const b of BRAZIERS)
    for (let o = -WARM.reach; o <= WARM.reach; o++) {
      const ix = b.x * RES + o;
      const near = 1 - Math.abs(o) / (WARM.reach + 1);
      for (let row = 0; row < 2 * RES; row++) {
        const iy = b.y * RES + row;
        if (near * (row < RES ? 1 : 0.6) < bayerAt(ix, iy) * 0.7) continue;
        paint.blend(ix, iy, WC.brazierGlow, WARM.most * strength * near, SLAB);
      }
    }
}

/** paint the wet slabs; `braziers` is how strongly the fires burn */
export function paintSlabs(paint: PlatePaint, r: Rng, P: ScenePalette, braziers: number): void {
  for (const p of PLATFORMS) {
    const x0 = p.x0 * RES;
    const x1 = p.x1 * RES + RES - 1;
    const top = p.y * RES;
    stains(paint, r, x0, x1, top);
    beads(paint, r, x0, x1, top);
    sheen(paint, x0, x1, top);
    moss(paint, r, x0, 1, top, P);
    moss(paint, r, x1, -1, top, P);
  }
  warmth(paint, braziers);
}
