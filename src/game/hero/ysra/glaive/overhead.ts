import { OVERHEAD } from "../../../../constants/ysra/glaive";
import type { Enemy } from "../../../../types/enemy";
import { enemyBox } from "../../../enemies/enemy";
import { game, hero } from "../../../state";
import { haftReach } from "./reach";

/** how far a foe's box is in front of her, edge to edge; negative when it is behind her */
function gapAhead(e: Enemy): number {
  const [x0, , x1] = enemyBox(e);
  if (hero.x >= x0 && hero.x <= x1) return 0;
  return hero.face > 0 ? x0 - hero.x : hero.x - x1;
}

/** a foe hovers over her within the sky thrust's reach, and none stands level with her close in front */
export function foeOverhead(): boolean {
  let high = false;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const gap = gapAhead(e);
    if (gap < 0) continue;
    const [, y0, , y1] = enemyBox(e);
    const above = hero.y - y1;
    if (above < OVERHEAD.chest) {
      if (gap < OVERHEAD.level && y0 < hero.y) return false;
      continue;
    }
    if (gap <= OVERHEAD.front + haftReach() && hero.y - y0 <= OVERHEAD.top + 8) high = true;
  }
  return high;
}
