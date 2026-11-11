import { FH, FW, GROUND, RES, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { RAIN_COLORS as RC } from "./palette";

/** The ruined towers in the rain: round in the light, built of stone courses, streaked dark where the water runs. */

const TOWER = [LAYER.tower] as const;
/** a tower's brightness from its shaded left side to its lit right side */
const SHADE = { left: 0.8, right: 1.08, steps: 5 };
/** stone courses on the towers, in image pixels: the height of a course, the length of a block, how dark a joint is */
const COURSE = { height: 12, block: 22, joint: 0.9 };
const STREAK = { chance: 0.1, length: [12, 90], dark: 0.82, sheenChance: 0.3, sheen: 0.16 } as const;

/** the tower edges that face left and right, as art pixel x and y pairs, for the lightning to rim */
export const TOWER_EDGES = { left: [] as number[], right: [] as number[] };

const isTower = (paint: PlatePaint, x: number, y: number): boolean => paint.layerAt(x * RES, y * RES) === LAYER.tower;
const isFar = (paint: PlatePaint, x: number, y: number): boolean => {
  const layer = paint.layerAt(x * RES, y * RES);
  return layer === LAYER.sky || layer === LAYER.celestial || layer === LAYER.ridge;
};

/** note where each tower meets the open air on either side */
function findEdges(paint: PlatePaint): void {
  TOWER_EDGES.left.length = 0;
  TOWER_EDGES.right.length = 0;
  for (let y = 0; y < GROUND; y++)
    for (let x = 0; x < W; x++) {
      if (!isTower(paint, x, y)) continue;
      if (isFar(paint, x - 1, y)) TOWER_EDGES.left.push(x, y);
      if (isFar(paint, x + 1, y)) TOWER_EDGES.right.push(x, y);
    }
}

/** for each image column, how far across its tower it lies from 0 at the left edge to 1 at the right, or -1 off a tower */
function acrossTowers(paint: PlatePaint): Float32Array {
  const has = new Uint8Array(FW);
  for (let iy = 0; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) if (paint.layerAt(ix, iy) === LAYER.tower) has[ix] = 1;
  const across = new Float32Array(FW).fill(-1);
  for (let ix = 0; ix < FW; ix++) {
    if (!has[ix]) continue;
    let end = ix;
    while (end + 1 < FW && has[end + 1]) end++;
    for (let i = ix; i <= end; i++) across[i] = (i - ix + 0.5) / (end - ix + 1);
    ix = end;
  }
  return across;
}

/** shade each tower round, lay its stone courses, and run dark water and a pale sheen down its face */
export function paintTowers(paint: PlatePaint, r: Rng, P: ScenePalette): void {
  findEdges(paint);
  const across = acrossTowers(paint);
  const lit = new Set([P.windowLit, P.windowLow]);
  for (let iy = 0; iy < GROUND * RES; iy++)
    for (let ix = 0; ix < FW; ix++) {
      if (across[ix] < 0 || !paint.on(ix, iy, TOWER)) continue;
      const c = paint.get(ix, iy);
      if (lit.has(c)) continue;
      const step = Math.floor(across[ix] * SHADE.steps + bayerAt(ix, iy) - 0.5) / (SHADE.steps - 1);
      let tone = SHADE.left + (SHADE.right - SHADE.left) * Math.min(1, Math.max(0, step));
      const course = Math.floor(iy / COURSE.height);
      const shift = (course % 2) * (COURSE.block / 2) + Math.floor(grain(course, 3) * 6);
      if (iy % COURSE.height === 0 || (ix + shift) % COURSE.block === 0) tone *= COURSE.joint;
      paint.put(ix, iy, scale(c, tone));
    }
  for (let ix = 0; ix < FW; ix++) {
    if (across[ix] < 0 || !r.chance(STREAK.chance)) continue;
    let top = 0;
    while (top < GROUND * RES && !paint.on(ix, top, TOWER)) top++;
    const from = top + r.int(0, 40);
    const length = r.int(STREAK.length[0], STREAK.length[1]);
    const sheen = r.chance(STREAK.sheenChance);
    for (let iy = from; iy < Math.min(GROUND * RES, from + length); iy++) {
      const fade = 1 - (iy - from) / length;
      if (sheen) paint.blend(ix, iy, RC.sheen, STREAK.sheen * fade, TOWER);
      else if (fade > bayerAt(ix, iy) * 0.7) paint.put(ix, iy, scale(paint.get(ix, iy), STREAK.dark), TOWER);
    }
  }
}
