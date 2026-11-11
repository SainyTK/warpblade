import { GROUND, H, PLATFORMS, RES, W } from "../../../constants/stage";
import type { Color, Ramp } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { groundAt, ridgeTopAt } from "../../terrain";
import type { ScenePalette } from "../sceneDef";
import { halo, lighten } from "./brush";
import { CRYSTAL, CRYSTAL_TEAL } from "./colors";
import { paintCluster } from "./crystal";
import { sizeAt } from "./growth";

/** Crystal growing on the floor, under the slabs, on the towers and along the far ridge, bigger as the era goes on. */

/** a crystal's light for the frame's glow: where it is in art pixels, how far it reaches, its color */
export interface CrystalLight {
  x: number;
  y: number;
  radius: number;
  color: Color;
}

interface Growth {
  /** art pixel column */
  x: number;
  /** full height in image pixels */
  size: number;
  /** the k at which it starts to grow */
  from: number;
  teal?: boolean;
}
const FLOOR: readonly Growth[] = [
  { x: 8, size: 24, from: 0 },
  { x: 70, size: 11, from: 0.25, teal: true },
  { x: 124, size: 15, from: 0.5 },
  { x: 196, size: 12, from: 0.75, teal: true },
  { x: 252, size: 17, from: 0.25 },
  { x: 314, size: 26, from: 0 },
];
/** hanging under the slabs: the slab, how far along it from 0 to 1, and the growth */
const HANGING: readonly (Growth & { slab: number })[] = [
  { slab: 0, x: 0.18, size: 15, from: 0.25 },
  { slab: 0, x: 0.8, size: 12, from: 0.75, teal: true },
  { slab: 1, x: 0.3, size: 13, from: 0.5, teal: true },
  { slab: 1, x: 0.86, size: 16, from: 0 },
  { slab: 2, x: 0.5, size: 14, from: 0.25 },
];
/** on top of the towers */
const ROOFS: readonly Growth[] = [
  { x: 22, size: 13, from: 0.25 },
  { x: 103, size: 15, from: 0, teal: true },
  { x: 168, size: 16, from: 0.5 },
  { x: 201, size: 10, from: 0.75, teal: true },
  { x: 238, size: 14, from: 0.25 },
  { x: 303, size: 12, from: 1 },
];
/** spires along the far ridge */
const RIDGE: readonly Growth[] = [
  { x: 44, size: 16, from: 0.25 },
  { x: 86, size: 11, from: 0.75, teal: true },
  { x: 132, size: 20, from: 0 },
  { x: 184, size: 12, from: 0.5 },
  { x: 222, size: 18, from: 0.25, teal: true },
  { x: 270, size: 13, from: 1 },
];
const FAR: readonly Layer[] = [LAYER.sky, LAYER.celestial, LAYER.ridge];
const GROUND_ONLY: readonly Layer[] = [LAYER.ground];
const HAZE = { roof: 0.2, ridge: 0.5 };
/** crystal light seeps along the floor's mortar this many art pixels from a cluster's foot */
const SEEP = { reach: 26, strength: 0.6, joints: 0.7 };
const FOOT_LIGHT = { radius: 14, strength: 0.16 };
const LIGHT_RADIUS = { floor: 12, hanging: 8, roof: 8 };

const tonesOf = (g: Growth): Ramp => (g.teal ? CRYSTAL_TEAL : CRYSTAL);

/** the first art row of tower stone in a column, or the ground line if there is none */
function roofAt(paint: PlatePaint, x: number): number {
  for (let y = 0; y < GROUND; y++) if (paint.layerAt(x * RES, y * RES) === LAYER.tower) return y;
  return GROUND;
}

/** the mortar joints near a cluster's foot fill with its light, strongest beside it */
function seep(paint: PlatePaint, P: ScenePalette, x: number, tint: Color, size: number): void {
  const reach = SEEP.reach * size;
  for (let y = GROUND + 2; y < H; y++)
    for (let ax = Math.max(0, Math.floor(x - reach)); ax <= Math.min(W - 1, x + reach); ax++) {
      if (groundAt(ax, y, P) !== P.mortar) continue;
      if (grain(ax >> 3, y) > SEEP.joints) continue;
      const d = Math.hypot(ax - x, (y - GROUND) * 1.6) / reach;
      if (d >= 1) continue;
      const a = SEEP.strength * (1 - d) ** 2;
      lighten(paint, ax * RES, y * RES, tint, a, GROUND_ONLY);
      lighten(paint, ax * RES + 1, y * RES, tint, a * 0.5, GROUND_ONLY);
      lighten(paint, ax * RES, y * RES + 1, tint, a * 0.5, GROUND_ONLY);
    }
}

/** paint every growth for progress k and return the lights of the ones near the fight */
export function paintGrowths(paint: PlatePaint, P: ScenePalette, k: number): CrystalLight[] {
  const lights: CrystalLight[] = [];
  const horizon = P.sky[P.sky.length - 1];
  for (const g of RIDGE) {
    const size = sizeAt(k, g.from);
    if (size <= 0) continue;
    const style = { tones: tonesOf(g), tint: (c: Color) => mix(c, horizon, HAZE.ridge), only: FAR };
    paintCluster(paint, g.x * RES, (ridgeTopAt(g.x) + 1) * RES, g.size * size, g.x, style);
  }
  for (const g of ROOFS) {
    const size = sizeAt(k, g.from);
    if (size <= 0) continue;
    const y = roofAt(paint, g.x);
    const style = { tones: tonesOf(g), tint: (c: Color) => mix(c, horizon, HAZE.roof) };
    paintCluster(paint, g.x * RES, (y + 1) * RES, g.size * size, g.x, style);
    lights.push({ x: g.x, y: y - 2, radius: LIGHT_RADIUS.roof, color: tonesOf(g)[2] });
  }
  for (const g of HANGING) {
    const size = sizeAt(k, g.from);
    if (size <= 0) continue;
    const p = PLATFORMS[g.slab];
    const x = Math.round(p.x0 + (p.x1 - p.x0) * g.x);
    paintCluster(paint, x * RES, (p.y + 9) * RES - 1, g.size * size, x, { tones: tonesOf(g) }, Math.PI);
    lights.push({ x, y: p.y + 11, radius: LIGHT_RADIUS.hanging, color: tonesOf(g)[2] });
  }
  for (const g of FLOOR) {
    const size = sizeAt(k, g.from);
    if (size <= 0) continue;
    const tones = tonesOf(g);
    seep(paint, P, g.x, tones[2], size);
    halo(paint, g.x * RES, GROUND * RES, FOOT_LIGHT.radius * size, tones[2], FOOT_LIGHT.strength, GROUND_ONLY);
    paintCluster(paint, g.x * RES, GROUND * RES, g.size * size, g.x, { tones });
    lights.push({ x: g.x, y: GROUND - (g.size * size) / (RES * 2), radius: LIGHT_RADIUS.floor, color: tones[2] });
  }
  return lights;
}
