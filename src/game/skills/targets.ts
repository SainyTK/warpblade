import { W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game } from "../state";

/** foes still standing, with their middle inside the stage by at least this much */
export function foesOnScreen(margin = 4): Enemy[] {
  return game.enemies.filter((e) => e.hp > 0 && e.x > margin && e.x < W - margin);
}

/** squared distance from a point to a foe's middle */
export function distance2(e: Enemy, x: number, y: number): number {
  const [cx, cy] = enemyCenter(e);
  return (cx - x) ** 2 + (cy - y) ** 2;
}

/** the standing foe on screen nearest a point, leaving out some, or null */
export function nearestFoe(x: number, y: number, skip: readonly Enemy[] = []): Enemy | null {
  let best: Enemy | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const e of foesOnScreen()) {
    if (skip.includes(e)) continue;
    const d = distance2(e, x, y);
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

/** a point within r of a foe's body */
export function touches(e: Enemy, x: number, y: number, r: number): boolean {
  const [x0, y0, x1, y1] = enemyBox(e);
  return x > x0 - r && x < x1 + r && y > y0 - r && y < y1 + r;
}
