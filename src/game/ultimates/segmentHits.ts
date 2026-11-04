import type { Enemy } from "../../types/enemy";
import { enemyBox } from "../enemies/enemy";
import { game } from "../state";

/** how far past a foe's box a thin projectile still catches it */
const SLACK = 4;

/** living foes not yet struck whose box the segment from (ax, ay) to (bx, by) passes through */
export function foesOnSegment(ax: number, ay: number, bx: number, by: number, struck: ReadonlySet<Enemy>): Enemy[] {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 2));
  return game.enemies.filter((e) => {
    if (struck.has(e) || e.hp <= 0) return false;
    const [x0, y0, x1, y1] = enemyBox(e);
    for (let i = 0; i <= n; i++) {
      const x = ax + ((bx - ax) * i) / n;
      const y = ay + ((by - ay) * i) / n;
      if (x > x0 - SLACK && x < x1 + SLACK && y > y0 - SLACK && y < y1 + SLACK) return true;
    }
    return false;
  });
}
