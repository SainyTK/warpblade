import type { Enemy } from "../../../types/enemy";
import type { SkillMemory } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { game } from "../../state";

/** a skill's memory as the shape its code keeps */
export const memoryAs = <T>(m: SkillMemory): T => m as unknown as T;

/** a foe thrown into by a spread is locked out of spreading or bursting again for this long (balance rule G5) */
export const SPREAD_LOCK = 0.5;

/** the parried or blocked foe: the living one nearest where the blow came from, close enough to have thrown it */
export function attackerAt(fromX: number, reach = 40): Enemy | null {
  let best: Enemy | null = null;
  let bestGap = reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const gap = Math.abs(enemyCenter(e)[0] - fromX);
    if (gap < bestGap) {
      best = e;
      bestGap = gap;
    }
  }
  return best;
}

/** the living foes whose middles are within `reach` pixels of a point */
export function foesWithin(x: number, y: number, reach: number, skip: Enemy | null = null): Enemy[] {
  return game.enemies.filter((e) => {
    if (e === skip || e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return Math.hypot(cx - x, cy - y) <= reach;
  });
}

/** the glaive moves and travel blows that count as heavy */
const HEAVY = new Set(["vaultCrash", "counterThrust", "impale", "impaleTwist", "runningImpale"]);
export const isHeavy = (move: string | null, diving: boolean): boolean => diving || (!!move && HEAVY.has(move));
