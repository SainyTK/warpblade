import { FH, FW, GROUND, PLATFORMS, RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import type { Platform } from "../../../types/world";
import { mix } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { smoothNoise } from "./noise";
import { stepBlend, tone } from "./plateTools";

/**
 * The floor and the slabs at image pixel detail: every block gets a lit top and right edge and a shaded left one,
 * the lips get a bright rim, chips and moss, and cracks run through the stone. The sun is at the upper right.
 */

/** the shared stage layout this detail follows, in art pixels: a course's height, a block's length, a slab's rows */
const FLOOR = { course: 7, block: 16, firstCourse: 2 };
const SLAB = { rows: 9, block: 12 };
const EDGE = { rim: 1.07, step: 0.9, jointShadow: 0.84, blockTop: 1.07, lit: 1.07, shaded: 0.91, jointDeep: 0.88 };
/** moss creeps over the lips and into the joints in patches */
const MOSS = { patch: 10, fine: 3.5, from: 0.6, cover: 0.72, jointBias: 0.16, perRow: 0.035, rows: 10 };
const CRACK = { dark: 0.72, lit: 1.08 };
/** a slab shades the wall behind it for this many image pixels below its underside */
const UNDER_SHADOW = { reach: 9, depth: 0.2 };
const FLOOR_ROW = GROUND * RES;

/** the lit top rim of a lip and the dark step under it; row is the art row from the lip, v the image row within it */
function lipTone(row: number, v: number): number {
  if (row === 0 && v === 0) return EDGE.rim;
  if (row === 1 && v === RES - 1) return EDGE.step;
  return 1;
}

/** the light on one image pixel of a block from where it sits beside a vertical joint; col counts art pixels from the joint */
function jointTone(col: number, block: number, u: number): number {
  if (col === 0) return u === RES - 1 ? EDGE.jointDeep : 1;
  if (col === block - 1 && u === RES - 1) return EDGE.lit;
  if (col === 1 && u === 0) return EDGE.shaded;
  return 1;
}

function moss(paint: PlatePaint, ix: number, iy: number, row: number, joint: boolean, c: Color): void {
  if (row >= MOSS.rows) return;
  const grown =
    smoothNoise(ix, iy * 1.6, MOSS.patch) * 0.6 +
    smoothNoise(ix + 50, iy, MOSS.fine) * 0.4 +
    (joint ? MOSS.jointBias : 0) -
    row * MOSS.perRow;
  if (grown > MOSS.from) stepBlend(paint, ix, iy, c, Math.min(MOSS.cover, (grown - MOSS.from) * 4), 3);
}

/** a crack running down and across the stone, dark with a lit lip on its right, stopping where the stone ends */
function crack(paint: PlatePaint, r: Rng, x: number, y: number, length: number, layer: Layer): void {
  let ix = x;
  const drift = r.pick([-1, 1]);
  for (let iy = y; iy < y + length; iy++) {
    if (paint.layerAt(ix, iy) !== layer || paint.decoratedAt(ix, iy)) return;
    tone(paint, ix, iy, CRACK.dark);
    if (paint.layerAt(ix + 1, iy) === layer) tone(paint, ix + 1, iy, CRACK.lit);
    ix += r.pick([0, 0, drift, drift, -drift]);
  }
}

/** small bites out of a lip's bright rim */
function chipLip(paint: PlatePaint, r: Rng, x0: number, x1: number, iy: number, count: number): void {
  for (let n = 0; n < count; n++) {
    const ix = r.int(x0, x1 - 6);
    const wide = r.int(2, 5);
    for (let u = 0; u < wide; u++) {
      tone(paint, ix + u, iy, 0.82);
      if (u > 0 && u < wide - 1 && wide > 3) tone(paint, ix + u, iy + 1, 0.9);
    }
  }
}

function paintFloor(paint: PlatePaint, r: Rng, P: ScenePalette): void {
  const mossTone = mix(P.moss, P.stone, 0.25);
  for (let iy = FLOOR_ROW; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) {
      if (paint.decoratedAt(ix, iy)) continue;
      const row = Math.floor(iy / RES) - GROUND;
      const v = iy % RES;
      let k = lipTone(row, v);
      let joint = false;
      if (row >= FLOOR.firstCourse) {
        const inCourse = (row - FLOOR.firstCourse) % FLOOR.course;
        const course = Math.floor((row - FLOOR.firstCourse) / FLOOR.course);
        const col = (Math.floor(ix / RES) + (course % 2 ? FLOOR.block / 2 : 0)) % FLOOR.block;
        joint = inCourse === FLOOR.course - 1 || col === 0;
        if (inCourse === FLOOR.course - 1) k = v === 0 ? EDGE.jointShadow : 1;
        else if (inCourse === 0 && v === 0 && col !== 0) k = EDGE.blockTop;
        else k = jointTone(col, FLOOR.block, ix % RES);
      }
      if (k !== 1) tone(paint, ix, iy, k);
      moss(paint, ix, iy, row, joint, mossTone);
    }
  chipLip(paint, r, 0, FW - 1, FLOOR_ROW, 16);
  for (let n = 0; n < 9; n++) crack(paint, r, r.int(8, FW - 8), FLOOR_ROW + r.int(0, 14), r.int(8, 22), LAYER.ground);
}

function paintSlab(paint: PlatePaint, r: Rng, p: Platform, P: ScenePalette): void {
  const top = p.y * RES;
  const left = p.x0 * RES;
  const right = (p.x1 + 1) * RES - 1;
  const mossTone = mix(P.moss, P.slab, 0.25);
  for (let iy = top; iy < top + SLAB.rows * RES; iy++)
    for (let ix = left; ix <= right; ix++) {
      if (paint.layerAt(ix, iy) !== LAYER.slab) continue;
      const row = Math.floor((iy - top) / RES);
      const v = iy % RES;
      const x = Math.floor((ix - left) / RES);
      const end = x === 0 || x === p.x1 - p.x0;
      let k = end ? 1 : lipTone(row, v);
      const body = row > 1 && row < SLAB.rows - 1 && !end;
      if (body) k = jointTone(x % SLAB.block, SLAB.block, ix % RES);
      if (k !== 1) tone(paint, ix, iy, k);
      if (row === SLAB.rows - 2 && v === RES - 1 && !end) paint.blend(ix, iy, P.slabUnder, 0.4);
      if (row === SLAB.rows - 1 && v === RES - 1) tone(paint, ix, iy, 0.8);
      // the slab's right end faces the sun
      if (x === p.x1 - p.x0 && row < SLAB.rows - 1) paint.blend(ix, iy, P.slabLip, ix === right ? 0.75 : 0.45);
      if (!end) moss(paint, ix, iy, row, body && x % SLAB.block === 0, mossTone);
    }
  chipLip(paint, r, left + RES, right - RES, top, 5);
  for (let n = 0; n < 2; n++) crack(paint, r, r.int(left + 6, right - 6), top + r.int(0, 4), r.int(6, 14), LAYER.slab);
  for (let j = 0; j < UNDER_SHADOW.reach; j++)
    for (let ix = left - j; ix <= right - j; ix++)
      tone(paint, ix, top + SLAB.rows * RES + j, 1 - UNDER_SHADOW.depth * (1 - j / UNDER_SHADOW.reach), [LAYER.tower]);
}

export function paintMasonry(paint: PlatePaint, r: Rng, P: ScenePalette): void {
  paintFloor(paint, r, P);
  for (const p of PLATFORMS) paintSlab(paint, r, p, P);
}
