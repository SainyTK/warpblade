import { FW, GROUND, PLATFORMS, RES, W } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale, WHITE } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { FLOWERS } from "./colors";
import { smoothNoise } from "./noise";
import { putSolid, tone, uncover } from "./plateTools";
import { isTower, roofRow, type TowerSpan } from "./towers";

/**
 * The day's plants at image pixel detail: grass blades, flowers and pebbles along the floor and the slab lips, leafy
 * vines hanging under the slabs and ivy creeping down the towers. It also picks the tall stalks that sway each frame.
 */

/** a tall stalk of grass that sways, some carrying a flower: its foot in image pixels, its height, and its own timing */
export interface Stalk {
  ix: number;
  iy: number;
  height: number;
  phase: number;
  /** the flower's petals and heart, or null for plain grass */
  flower: readonly [Color, Color] | null;
}

/** a lip plants grow on: image columns first to last, and the image row of the lip's top */
interface Lip {
  x0: number;
  x1: number;
  iy: number;
}

interface Greens {
  deep: Color;
  dark: Color;
  mid: Color;
  lit: Color;
  tip: Color;
}
const greens = (P: ScenePalette): Greens => ({
  deep: scale(P.vine, 0.78),
  dark: P.vine,
  mid: P.moss,
  lit: mix(P.moss, P.mossTip, 0.6),
  tip: mix(P.mossTip, WHITE, 0.25),
});

/** grass grows in clumps this many image pixels across; a blade is up to `tall` image pixels in the thickest clump */
const GRASS = { clump: 18, thin: 0.16, thick: 0.62, short: 2, tall: 8 };
const FLOWER_CHANCE = 0.03;
const STALK_CHANCE = 0.022;
const STALK = { short: 8, tall: 13, flowerShare: 0.45 };
const PEBBLES = 11;
/** vines under a slab: one for every this many image columns, most short, some long */
const VINE = { every: 14, longShare: 0.3, short: [5, 16], long: [20, 46], leafEvery: 3 };
/** ivy on a tower's top: the chance a roof column starts a strand, and its length in image pixels */
const IVY = { chance: 0.13, longShare: 0.4, short: [4, 12], long: [16, 64], clump: 3 };
/** the art rows above the floor and under a slab where the shared stage paints its blocky tufts and vines */
const SHARED_TUFT_ROWS = 3;
const SHARED_VINE_ROWS = 8;
const SLAB_ROWS = 9;

/** a leaf two image pixels long, lit at its tip, hanging to one side of a stem */
function leaf(paint: PlatePaint, ix: number, iy: number, side: number, G: Greens): void {
  putSolid(paint, ix + side, iy, G.mid);
  putSolid(paint, ix + side * 2, iy, G.lit);
  putSolid(paint, ix + side, iy + 1, G.dark);
}

function blade(paint: PlatePaint, r: Rng, ix: number, base: number, height: number, G: Greens): void {
  const lean = r.pick([-1, 0, 0, 1]);
  for (let j = 0; j < height; j++) {
    const u = j / height;
    const c = u < 0.34 ? G.dark : u < 0.7 ? G.mid : j === height - 1 && height > 4 ? G.tip : G.lit;
    putSolid(paint, ix + Math.round(lean * u * u * 2), base - j, c);
  }
}

function flower(paint: PlatePaint, r: Rng, ix: number, base: number, G: Greens): void {
  const [petal, heart] = r.pick(FLOWERS);
  const height = r.int(4, 8);
  for (let j = 0; j < height; j++) putSolid(paint, ix, base - j, j < 2 ? G.dark : G.mid);
  putSolid(paint, ix + r.pick([-1, 1]), base - 2, G.lit);
  const top = base - height;
  for (const [u, v] of [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
  ])
    putSolid(paint, ix + u, top + v, petal);
  putSolid(paint, ix, top, heart);
}

/** a small stone sitting on a lip, lit on its upper right */
function pebble(paint: PlatePaint, r: Rng, ix: number, base: number, P: ScenePalette): void {
  const wide = r.int(3, 6);
  const tall = wide > 4 ? 3 : 2;
  for (let j = 0; j < tall; j++) {
    const inset = j === tall - 1 ? 1 : 0;
    for (let u = inset; u < wide - inset; u++) {
      const c =
        j === tall - 1 || u >= wide - 1 - inset ? P.stoneTop : u === 0 ? scale(P.stone, 0.7) : scale(P.stone, 0.92);
      putSolid(paint, ix + u, base - j, c);
    }
  }
  for (let u = -1; u < wide; u++) tone(paint, ix + u, base + 1, 0.86);
}

function meadow(paint: PlatePaint, r: Rng, lip: Lip, G: Greens, stalks: Stalk[]): void {
  const base = lip.iy - 1;
  for (let ix = lip.x0; ix <= lip.x1; ix++) {
    if (paint.layerAt(ix, base) === LAYER.prop) continue;
    const thick = smoothNoise(ix, lip.iy * 7, GRASS.clump);
    if (r.chance(GRASS.thin + thick * (GRASS.thick - GRASS.thin)))
      blade(paint, r, ix, base, 1 + Math.floor(r.next() ** 1.5 * (GRASS.short + thick * GRASS.tall)), G);
    if (r.chance(FLOWER_CHANCE)) flower(paint, r, ix, base, G);
    if (r.chance(STALK_CHANCE))
      stalks.push({
        ix,
        iy: base,
        height: r.int(STALK.short, STALK.tall),
        phase: r.range(0, 6.28),
        flower: r.chance(STALK.flowerShare) ? r.pick(FLOWERS) : null,
      });
  }
}

/** a strand of leaves hanging from (ix, iy) while `grows` allows it, swinging a little wider toward its tip */
function strand(
  paint: PlatePaint,
  r: Rng,
  ix: number,
  iy: number,
  length: number,
  G: Greens,
  grows: (x: number, y: number) => boolean,
): void {
  const swing = r.range(0, 6.28);
  let side = r.pick([-1, 1]);
  for (let j = 0; j < length; j++) {
    const x = ix + Math.round(Math.sin(j * 0.33 + swing) * 1.3 * (j / length));
    const y = iy + j;
    if (!grows(x, y)) return;
    putSolid(paint, x, y, j % 4 === 1 ? G.mid : G.dark);
    if (j % VINE.leafEvery === 1 && grows(x + side * 2, y)) {
      leaf(paint, x, y, side, G);
      side = -side;
    }
    if (j === length - 1) putSolid(paint, x, y + 1, G.tip);
  }
}

function hangingVines(paint: PlatePaint, r: Rng, G: Greens): void {
  const floor = GROUND * RES - 2;
  const free = (x: number, y: number): boolean => y < floor && paint.layerAt(x, y) !== LAYER.prop;
  for (const p of PLATFORMS) {
    const under = (p.y + SLAB_ROWS) * RES;
    const count = Math.round(((p.x1 - p.x0) * RES) / VINE.every);
    for (let n = 0; n < count; n++) {
      const [a, b] = r.chance(VINE.longShare) ? VINE.long : VINE.short;
      strand(paint, r, r.int((p.x0 + 2) * RES, (p.x1 - 2) * RES), under, r.int(a, b), G, free);
    }
  }
}

/** a bushy clump of leaves over a tower's top, the leaves on its upper right catching the sun */
function clump(paint: PlatePaint, r: Rng, ix: number, iy: number, G: Greens): void {
  for (let n = 0; n < 14; n++) {
    const u = r.int(-IVY.clump, IVY.clump);
    const v = r.int(-2, IVY.clump);
    const light = u - v * 1.5 + r.range(-1.5, 1.5);
    putSolid(paint, ix + u, iy + v, light > 2 ? G.tip : light > 0 ? G.lit : light > -2.5 ? G.mid : G.dark);
  }
}

function ivy(paint: PlatePaint, r: Rng, spans: readonly TowerSpan[], G: Greens): void {
  const onWall = (x: number, y: number): boolean => isTower(paint, x, y);
  for (const span of spans)
    for (let ix = span.x0 + 1; ix < span.x1; ix++) {
      if (!r.chance(IVY.chance)) continue;
      const top = roofRow(paint, ix);
      if (top >= GROUND * RES || !isTower(paint, ix, top)) continue;
      const [a, b] = r.chance(IVY.longShare) ? IVY.long : IVY.short;
      strand(paint, r, ix, top, r.int(a, b), G, onWall);
      clump(paint, r, ix, top, G);
    }
}

/** take away the shared stage's blocky tufts over the floor and vines under the slabs, so fine ones can grow there */
function clearSharedPlants(paint: PlatePaint): void {
  for (let x = 0; x < W; x++)
    for (let y = GROUND - SHARED_TUFT_ROWS; y < GROUND; y++)
      if (paint.layerAt(x * RES, y * RES) === LAYER.ground) uncover(paint, x, y, LAYER.ground);
  for (const p of PLATFORMS)
    for (let x = p.x0; x <= p.x1; x++)
      for (let y = p.y + SLAB_ROWS; y < p.y + SLAB_ROWS + SHARED_VINE_ROWS; y++)
        if (paint.layerAt(x * RES, y * RES) === LAYER.slab) uncover(paint, x, y, LAYER.slab);
}

/** grow every plant of the scene and return the stalks left to sway each frame */
export function paintFlora(paint: PlatePaint, r: Rng, P: ScenePalette, spans: readonly TowerSpan[]): Stalk[] {
  const G = greens(P);
  const stalks: Stalk[] = [];
  clearSharedPlants(paint);
  ivy(paint, r, spans, G);
  hangingVines(paint, r, G);
  const floor: Lip = { x0: 0, x1: FW - 1, iy: GROUND * RES };
  for (let n = 0; n < PEBBLES; n++) pebble(paint, r, r.int(4, FW - 10), floor.iy - 1, P);
  meadow(paint, r, floor, G, stalks);
  for (const p of PLATFORMS) meadow(paint, r, { x0: (p.x0 + 1) * RES, x1: p.x1 * RES - 1, iy: p.y * RES }, G, stalks);
  return stalks;
}
