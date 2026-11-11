import { FW, GROUND, RES, W } from "../../../constants/stage";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { smoothNoise } from "./noise";
import { openSky } from "./openSky";
import { stepBlend, tone } from "./plateTools";

/**
 * The ruined towers at image pixel detail: stone courses with a lit edge on each block, a shaded left face and a soft
 * lit right edge (the sun is at the upper right), moss stains, cracks, missing blocks, chipped edges and window slits.
 */

/** one tower's image columns, first and last */
export interface TowerSpan {
  x0: number;
  x1: number;
}

const ROWS = GROUND * RES;
/** a course's height and a block's length, in image pixels */
const COURSE = 12;
const BLOCK = 20;
const STONE = { blockDepth: 0.08, joint: 0.86, lit: 1.06 };
/** the shaded left face: its width in image pixels and how dark it gets at the edge */
const SHADE = { width: 12, depth: 0.3, tone: 0.7 };
/** the lit right edge is this many image pixels wide; the stone beside it catches a little of its light */
const RIM = { width: 4, spill: 3, spillLight: 0.24 };
/** moss grows in patches, more on the shaded side and near the floor */
const MOSS = { patch: 15, fine: 5, from: 0.6, cover: 0.55, shadeBias: 0.1, footBias: 0.34, foot: 30 };
const CRACK = { perTower: 3, dark: 0.74, lit: 1.07 };
const HOLE = { perTower: 3, floor: 0.86, shadow: 0.72, lit: 1.06 };
const CHIP_CHANCE = 0.035;

export const isTower = (paint: PlatePaint, ix: number, iy: number): boolean =>
  paint.layerAt(ix, iy) === LAYER.tower && !openSky[iy * FW + ix];

/** the towers as runs of image columns that hold any tower pixel */
export function towerSpans(paint: PlatePaint): TowerSpan[] {
  const spans: TowerSpan[] = [];
  let open: TowerSpan | null = null;
  for (let x = 0; x <= W; x++) {
    let has = false;
    for (let y = 0; x < W && y < GROUND && !has; y++) has = paint.layerAt(x * RES, y * RES) === LAYER.tower;
    if (has && !open) {
      open = { x0: x * RES, x1: x * RES };
      spans.push(open);
    }
    if (has && open) open.x1 = x * RES + RES - 1;
    if (!has) open = null;
  }
  return spans;
}

/** the first row of a tower in an image column, or the floor's row when the column holds none */
export function roofRow(paint: PlatePaint, ix: number): number {
  let iy = 0;
  while (iy < ROWS && !isTower(paint, ix, iy)) iy++;
  return iy;
}

function stone(paint: PlatePaint, span: TowerSpan, P: ScenePalette): void {
  const shade = scale(P.tower, SHADE.tone);
  const moss = mix(P.moss, P.tower, 0.3);
  for (let ix = span.x0; ix <= span.x1; ix++) {
    const fromLeft = ix - span.x0;
    const fromRight = span.x1 - ix;
    for (let iy = 0; iy < ROWS; iy++) {
      if (!isTower(paint, ix, iy) || paint.get(ix, iy) === P.windowDark) continue;
      const course = Math.floor(iy / COURSE);
      const alongBlock = (ix + (course % 2) * (BLOCK / 2)) % BLOCK;
      const block = Math.floor((ix + (course % 2) * (BLOCK / 2)) / BLOCK);
      const inCourse = iy % COURSE;
      let k = 1 + (grain(course * 7 + span.x0, block * 13 + 1) - 0.5) * STONE.blockDepth;
      if (inCourse === 0 || alongBlock === 0) k *= STONE.joint;
      else if (inCourse === 1 || alongBlock === BLOCK - 1) k *= STONE.lit;
      let c = scale(paint.get(ix, iy), k);
      if (fromRight === RIM.width - 1) c = mix(c, P.tower, 0.45);
      else if (fromRight >= RIM.width && fromRight < RIM.width + RIM.spill) c = mix(c, P.towerRim, RIM.spillLight);
      paint.put(ix, iy, c);
      if (fromLeft < SHADE.width) stepBlend(paint, ix, iy, shade, (1 - fromLeft / SHADE.width) * SHADE.depth, 4);
      const grown =
        smoothNoise(ix + span.x0 * 31, iy, MOSS.patch) * 0.62 +
        smoothNoise(ix, iy + span.x0 * 17, MOSS.fine) * 0.38 +
        (fromLeft < SHADE.width ? MOSS.shadeBias : 0) +
        Math.max(0, (iy - (ROWS - MOSS.foot)) / MOSS.foot) * MOSS.footBias;
      if (grown > MOSS.from) stepBlend(paint, ix, iy, moss, Math.min(MOSS.cover, (grown - MOSS.from) * 3.2), 3);
    }
  }
}

/** a crack wandering down the wall, dark with a lit lip on its right */
function crack(paint: PlatePaint, r: Rng, x: number, y: number, length: number): void {
  let ix = x;
  for (let iy = y; iy < y + length; iy++) {
    if (!isTower(paint, ix, iy)) return;
    tone(paint, ix, iy, CRACK.dark);
    if (isTower(paint, ix + 1, iy)) tone(paint, ix + 1, iy, CRACK.lit);
    ix += r.pick([-1, 0, 0, 0, 1]);
  }
}

/** a block fallen out of the wall: a recess shaded under its top and along its right, lit along its bottom */
function hole(paint: PlatePaint, r: Rng, span: TowerSpan): void {
  const course = r.int(4, Math.floor(ROWS / COURSE) - 2);
  const shift = (course % 2) * (BLOCK / 2);
  const block = Math.floor((r.int(span.x0, span.x1) + shift) / BLOCK);
  const x0 = block * BLOCK - shift + 1;
  const y0 = course * COURSE + 1;
  for (let iy = y0; iy < y0 + COURSE - 1; iy++)
    for (let ix = x0; ix < x0 + BLOCK - 1; ix++) {
      if (!isTower(paint, ix, iy) || span.x1 - ix < RIM.width) continue;
      const k = iy - y0 < 2 || ix >= x0 + BLOCK - 3 ? HOLE.shadow : iy === y0 + COURSE - 2 ? HOLE.lit : HOLE.floor;
      tone(paint, ix, iy, k);
    }
}

/** bites out of a tower's two edges where the sky shows behind it */
function chips(paint: PlatePaint, r: Rng, span: TowerSpan, sky: Uint32Array): void {
  for (const [edge, out] of [
    [span.x0, -1],
    [span.x1, 1],
  ])
    for (let iy = 0; iy < ROWS; iy++) {
      if (!r.chance(CHIP_CHANCE)) continue;
      const deep = r.int(1, 2);
      const tall = r.int(2, 5);
      for (let v = 0; v < tall; v++)
        for (let u = 0; u < deep; u++) {
          const ix = edge - out * u;
          const beside = (iy + v) * FW + ix + out;
          if (!isTower(paint, ix, iy + v) || !openSky[beside]) continue;
          const i = (iy + v) * FW + ix;
          paint.plate[i] = sky[i];
          openSky[i] = 1;
        }
    }
}

/** a window slit: a dark opening deepest on its left, under a shaded lintel, over a sunlit sill */
function windowSlit(paint: PlatePaint, x: number, y: number, P: ScenePalette): void {
  const ix = x * RES;
  const iy = y * RES;
  for (let v = 0; v < RES * 2; v++) {
    tone(paint, ix, iy + v, v < 2 ? 0.74 : 0.86);
    if (v < 2) tone(paint, ix + 1, iy + v, 0.88);
  }
  for (let u = -1; u <= RES; u++) {
    if (isTower(paint, ix + u, iy - 1)) tone(paint, ix + u, iy - 1, 0.84);
    if (isTower(paint, ix + u, iy + RES * 2)) paint.blend(ix + u, iy + RES * 2, P.towerRim, 0.6);
  }
}

/** paint every tower's stone; `windows` are the art pixels at the top of each window */
export function paintTowers(
  paint: PlatePaint,
  r: Rng,
  P: ScenePalette,
  sky: Uint32Array,
  windows: readonly (readonly [number, number])[],
): void {
  for (const span of towerSpans(paint)) {
    stone(paint, span, P);
    for (let n = 0; n < HOLE.perTower; n++) hole(paint, r, span);
    for (let n = 0; n < CRACK.perTower; n++)
      crack(paint, r, r.int(span.x0 + 3, span.x1 - RIM.width - 2), r.int(120, ROWS - 40), r.int(14, 44));
    chips(paint, r, span, sky);
  }
  for (const [x, y] of windows) windowSlit(paint, x, y, P);
}
