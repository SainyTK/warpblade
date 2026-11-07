import { OVERHEAD } from "../../../../constants/ysra/glaive";
import { enemyBox } from "../../../enemies/enemy";
import { game, hero } from "../../../state";
import { gapAhead } from "./foes";
import { haftReach } from "./reach";

/** a foe hovers over her within the sky thrust's reach (or the Skyhook's, `reach` pixels up), and none stands level
 *  with her close in front */
export function foeOverhead(reach = 0): boolean {
  const top = Math.max(OVERHEAD.top, reach) + 8;
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
    if (gap <= OVERHEAD.front + haftReach() && hero.y - y0 <= top) high = true;
  }
  return high;
}
