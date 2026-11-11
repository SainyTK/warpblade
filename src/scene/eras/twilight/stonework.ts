import { FW, GROUND, PLATFORMS, RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { hairline, lighten } from "./brush";
import { STONE_LIGHT } from "./colors";
import { TOWERS } from "./towers";

/** The towers and slabs as worked stone under the veil's light: courses, a lit right edge, a shaded left, glowing veins. */

const TOWER_ONLY: readonly Layer[] = [LAYER.tower];
const SLAB_ONLY: readonly Layer[] = [LAYER.slab];
/** the light on a tower's right edge, by image pixels in from the edge */
const RIM = [0.7, 0.34, 0.16, 0.07];
const RIM_CHIP = 0.14;
/** the shade on a tower's left side fades out over this many image pixels */
const SHADE = { reach: 10, depth: 0.2 };
const TOP_LIGHT = 0.4;
/** a course of tower stone is this many image pixels tall and a block this many wide */
const COURSE = { height: 12, block: 20, joint: 0.88, bevel: 1.07 };
const SLAB_EDGE = [0.55, 0.22];
const VEIN = { stride: 3, strength: 0.6, spill: 0.14, branch: 0.1, wander: 0.55 };

const behind = (layer: Layer | undefined): boolean =>
  layer === LAYER.sky || layer === LAYER.celestial || layer === LAYER.ridge;

/** the veil's light is lilac high on a tower and teal toward the floor */
const lightAt = (iy: number): Color => mix(STONE_LIGHT.high, STONE_LIGHT.low, iy / (GROUND * RES));

/** stone courses, then light down each tower's right edge and along its top, and shade on its left */
export function paintTowerStone(paint: PlatePaint, P: ScenePalette, veil: number): void {
  const lit = new Set<Color>([P.windowLit, P.windowLow]);
  for (let iy = 0; iy < GROUND * RES; iy++) {
    const light = lightAt(iy);
    const course = Math.floor(iy / COURSE.height);
    for (let ix = 0; ix < FW; ix++) {
      if (paint.layerAt(ix, iy) !== LAYER.tower) continue;
      const under = paint.get(ix, iy);
      if (lit.has(under)) continue;
      let tone = 1;
      const row = iy % COURSE.height;
      if (row === 0 || (ix + (course % 2) * (COURSE.block / 2)) % COURSE.block === 0) tone = COURSE.joint;
      else if (row === 1) tone = COURSE.bevel;
      let left = 1;
      while (left <= SHADE.reach && paint.layerAt(ix - left, iy) === LAYER.tower) left++;
      if (left <= SHADE.reach && behind(paint.layerAt(ix - left, iy)))
        tone *= 1 - SHADE.depth * (1 - left / SHADE.reach);
      if (tone !== 1) paint.put(ix, iy, scale(under, tone));
      let right = 1;
      while (right <= RIM.length && paint.layerAt(ix + right, iy) === LAYER.tower) right++;
      const chipped = grain(ix >> 2, iy >> 2) < RIM_CHIP;
      if (right <= RIM.length && behind(paint.layerAt(ix + right, iy)) && !chipped)
        lighten(paint, ix, iy, light, RIM[right - 1] * veil);
      else if (behind(paint.layerAt(ix, iy - 1))) lighten(paint, ix, iy, light, TOP_LIGHT * veil);
    }
  }
}

/** the veil's light on the right end of each slab */
export function paintSlabLight(paint: PlatePaint, veil: number): void {
  for (const p of PLATFORMS)
    for (let iy = p.y * RES; iy < (p.y + 9) * RES; iy++)
      SLAB_EDGE.forEach((a, i) => {
        lighten(paint, p.x1 * RES + 1 - i, iy, lightAt(iy), a * veil, SLAB_ONLY);
      });
}

/** one glowing vein climbing a tower from (x, y) in image pixels, wandering and now and then forking */
function vein(paint: PlatePaint, r: Rng, x: number, y: number, steps: number, heading: number, tint: Color): void {
  let a = heading;
  for (let i = 0; i < steps; i++) {
    a = heading + (a - heading) * 0.5 + r.range(-VEIN.wander, VEIN.wander);
    const nx = x + Math.sin(a) * VEIN.stride;
    const ny = y - Math.cos(a) * VEIN.stride;
    const fade = 1 - i / steps;
    hairline(paint, x, y, nx, ny, tint, VEIN.strength * fade, TOWER_ONLY);
    lighten(paint, Math.floor(nx) + 1, Math.floor(ny), tint, VEIN.spill * fade, TOWER_ONLY);
    lighten(paint, Math.floor(nx) - 1, Math.floor(ny), tint, VEIN.spill * fade, TOWER_ONLY);
    if (steps - i > 6 && r.chance(VEIN.branch))
      vein(paint, r, nx, ny, (steps - i) >> 1, heading + r.pick([-1, 1]), tint);
    x = nx;
    y = ny;
  }
}

/** veins of the veil's light creeping up the towers from the floor, longer as the era goes on */
export function paintVeins(paint: PlatePaint, r: Rng, veil: number, horizon: Color): void {
  const tint = mix(STONE_LIGHT.vein, horizon, 0.3);
  for (const [tx, tw] of TOWERS) {
    const count = tw > 16 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const x = (tx + r.range(3, tw - 3)) * RES;
      const steps = Math.round(r.range(10, 26) * veil);
      vein(paint, r, x, (GROUND - 1) * RES, steps, r.range(-0.25, 0.25), tint);
    }
  }
}
