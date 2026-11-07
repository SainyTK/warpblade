import { W } from "../../constants/stage";
import { ULT_REACH } from "../../constants/ultimate";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { game, hero } from "../state";

/** foes an ultimate reaches, nearest first: in front at levels 1 and 2, both sides at 3 (or from `bothFrom`), everyone at 4 */
export function ultTargets(level: number, bothFrom = 3): Enemy[] {
  const reach = ULT_REACH[level - 1];
  return game.enemies
    .filter((e) => {
      if (e.hp <= 0) return false;
      const dx = e.x - hero.x;
      if (Math.abs(dx) > reach) return false;
      return level >= bothFrom || dx * hero.face > -10;
    })
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** the stretch of floor an ultimate covers, for effects that land where no foe stands */
export function ultSpan(level: number, bothFrom = 3): [number, number] {
  const reach = Math.min(W, ULT_REACH[level - 1]);
  if (level >= 4) return [10, W - 10];
  if (level >= bothFrom) return [clamp(hero.x - reach, 10, W - 10), clamp(hero.x + reach, 10, W - 10)];
  const far = hero.x + hero.face * reach;
  return [clamp(Math.min(hero.x, far), 10, W - 10), clamp(Math.max(hero.x, far), 10, W - 10)];
}
