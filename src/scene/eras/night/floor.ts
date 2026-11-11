import { BRAZIERS, FW, GROUND, PLATFORMS, RES } from "../../../constants/stage";
import { cb, cg, cr } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { FIRE_EDGE, FIRE_STONE, FLOOR_LIP_LIGHT, FLOOR_WASH, GRASS, MOON_EDGE, VINE_LIGHT } from "./colors";
import { valueNoise } from "./noise";

/**
 * The floor and the slabs at image pixel detail: blue moonlight along every top edge and on the slab ends that face
 * the moon, firelight on the stone round each brazier, fine grass along the floor and light on the hanging vines.
 */

const STONE: readonly Layer[] = [LAYER.ground, LAYER.slab];
const BEHIND: readonly Layer[] = [LAYER.sky, LAYER.celestial, LAYER.ridge, LAYER.tower];
/** the blue wash on the floor fades out this many image pixels below its lip */
const LIP = { edge: 0.6, wash: 0.2, depth: 14 };
const SLAB_TALL = 9 * RES;
/** firelight on stone round a brazier: how far it reaches in image pixels, on the slab and on the walls behind */
const FIRE = { slab: 46, slabStrength: 0.5, wall: 64, wallStrength: 0.16, bowl: 0.5 };
/** grass: the share of image pixel columns with a blade, and blade heights in image pixels */
const BLADES = { share: 0.34, low: 2, high: 9, slabShare: 0.07, slabHigh: 4 };

const isGreen = (c: number): boolean => cg(c) > cr(c) + 12 && cg(c) > cb(c) + 4;

/** a broken bright line along the top of the floor and of each slab, and a blue wash under the floor's lip */
function paintLips(paint: PlatePaint): void {
  const top = GROUND * RES;
  for (let ix = 0; ix < FW; ix++) {
    const worn = valueNoise(ix / 9, 3.5);
    paint.blend(ix, top, FLOOR_LIP_LIGHT, LIP.edge * (0.45 + 0.55 * worn), STONE);
    for (let d = 1; d < LIP.depth; d++) paint.blend(ix, top + d, FLOOR_WASH, LIP.wash * (1 - d / LIP.depth), STONE);
  }
  for (const p of PLATFORMS) {
    const y = p.y * RES;
    for (let ix = p.x0 * RES; ix <= p.x1 * RES + 1; ix++)
      paint.blend(ix, y, FLOOR_LIP_LIGHT, LIP.edge * (0.4 + 0.6 * valueNoise(ix / 9, p.y)), STONE);
    // the end that faces the moon
    const end = p.x1 * RES;
    for (let iy = y + 1; iy < y + SLAB_TALL - 2; iy++) {
      paint.blend(end, iy, MOON_EDGE, 0.3, STONE);
      paint.blend(end + 1, iy, MOON_EDGE, 0.62, STONE);
    }
  }
}

/** warm light pooled on the slab under each brazier, on its bowl, and faintly on the walls behind */
function paintFirelight(paint: PlatePaint): void {
  for (const b of BRAZIERS) {
    const cx = b.x * RES + 1;
    const cy = b.y * RES;
    for (let iy = cy - FIRE.wall; iy <= cy + FIRE.wall; iy++)
      for (let ix = cx - FIRE.wall; ix <= cx + FIRE.wall; ix++) {
        const layer = paint.layerAt(ix, iy);
        if (layer === undefined) continue;
        const d = Math.hypot(ix - cx, iy - (cy - 14));
        if (layer === LAYER.slab) {
          const near = 1 - Math.hypot(ix - cx, (iy - cy) * 2.2) / FIRE.slab;
          if (near > 0) paint.blend(ix, iy, iy === cy ? FIRE_EDGE : FIRE_STONE, FIRE.slabStrength * near * near);
        } else if (layer === LAYER.prop) {
          if (paint.layerAt(ix, iy - 1) !== LAYER.prop) paint.blend(ix, iy, FIRE_EDGE, FIRE.bowl);
        } else if (layer === LAYER.tower || layer === LAYER.ridge) {
          const near = 1 - d / FIRE.wall;
          if (near > 0) paint.blend(ix, iy, FIRE_STONE, FIRE.wallStrength * near * near);
        }
      }
  }
}

/** one blade of grass rising from (ix, base), leaning as it climbs, its tip lit when it leans toward the moon */
function blade(paint: PlatePaint, ix: number, base: number, tall: number, lean: number): void {
  for (let h = 0; h < tall; h++) {
    const x = ix + (h > tall * 0.55 ? lean : 0);
    const tip = h === tall - 1;
    const tone = tip ? (lean >= 0 ? GRASS[3] : GRASS[2]) : h < tall * 0.4 ? GRASS[0] : GRASS[1];
    paint.put(x, base - 1 - h, tone, BEHIND);
  }
}

/** fine grass in tufts along the floor, and a few short blades on the slabs */
function paintGrass(paint: PlatePaint): void {
  const floor = GROUND * RES;
  for (let ix = 0; ix < FW; ix++) {
    const tuft = valueNoise(ix / 22, 8.2);
    if (grain(ix, 71) > BLADES.share * (0.3 + 1.4 * tuft)) continue;
    const tall = Math.round(BLADES.low + grain(ix, 13) * (BLADES.high - BLADES.low) * (0.35 + 0.65 * tuft));
    blade(paint, ix, floor, tall, Math.floor(grain(ix, 29) * 3) - 1);
  }
  for (const p of PLATFORMS)
    for (let ix = p.x0 * RES + 2; ix < p.x1 * RES; ix++) {
      if (grain(ix, p.y + 5) > BLADES.slabShare) continue;
      blade(paint, ix, p.y * RES, 1 + Math.round(grain(ix, 37) * BLADES.slabHigh), Math.floor(grain(ix, 43) * 3) - 1);
    }
}

/** the hanging vines and the moss catch moonlight on the side that faces the moon, and the vines grow small leaves */
function paintVines(paint: PlatePaint): void {
  for (const p of PLATFORMS) {
    const top = (p.y + 9) * RES;
    for (let iy = top; iy < top + 8 * RES; iy++)
      for (let ix = p.x0 * RES; ix <= p.x1 * RES + 1; ix++) {
        if (!isGreen(paint.get(ix, iy)) || isGreen(paint.get(ix + 1, iy))) continue;
        paint.blend(ix, iy, VINE_LIGHT, 0.5);
        if (grain(ix, iy) < 0.3) paint.put(ix + 1, iy, GRASS[1], BEHIND);
        else if (grain(ix, iy) > 0.75) paint.put(ix - 2, iy, GRASS[0], BEHIND);
      }
  }
  const floor = GROUND * RES;
  for (let iy = floor - 4 * RES; iy < floor; iy++)
    for (let ix = 0; ix < FW; ix++)
      if (isGreen(paint.get(ix, iy)) && !isGreen(paint.get(ix + 1, iy)) && !isGreen(paint.get(ix, iy - 1)))
        paint.blend(ix, iy, VINE_LIGHT, 0.45);
}

export function paintFloor(paint: PlatePaint): void {
  paintLips(paint);
  paintFirelight(paint);
  paintVines(paint);
  paintGrass(paint);
}
