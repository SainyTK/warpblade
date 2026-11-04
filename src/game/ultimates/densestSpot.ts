import { W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { hero } from "../state";
import { surfaceBelow } from "../world";

/** foes this far either side of a spot count as standing there */
const SPREAD = 40;
const EDGE = 14;
/** with no foe in reach, the crash lands this far ahead */
const AHEAD = 60;

/** where the most of these foes stand, nearest to the hero on a tie, and the floor under it */
export function densestSpot(foes: readonly Enemy[]): { x: number; floor: number } {
  let best: Enemy[] = [];
  for (const f of foes) {
    const fx = enemyCenter(f)[0];
    const near = foes.filter((e) => Math.abs(enemyCenter(e)[0] - fx) <= SPREAD);
    if (near.length > best.length) best = near;
  }
  if (!best.length) {
    const x = clamp(hero.x + hero.face * AHEAD, EDGE, W - EDGE);
    return { x, floor: surfaceBelow(x, hero.y - 1) };
  }
  const centers = best.map(enemyCenter);
  const x = clamp(centers.reduce((s, c) => s + c[0], 0) / centers.length, EDGE, W - EDGE);
  const y = Math.max(...centers.map((c) => c[1]));
  return { x, floor: surfaceBelow(x, y) };
}
