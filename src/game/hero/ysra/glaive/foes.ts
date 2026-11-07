import type { Enemy } from "../../../../types/enemy";
import { enemyBox } from "../../../enemies/enemy";
import { game, hero } from "../../../state";
import { haftReach } from "./reach";

/** the thrust's reach ahead of her feet, and the ground lash's, before her reach grows them */
const THRUST_REACH = 40;
const LASH_REACH = 60;
/** a foe counts as level with her when its box comes down below this many pixels over her feet */
const LEVEL = 26;

/** how far a foe's box is in front of her, edge to edge; negative when it is behind her */
export function gapAhead(e: Enemy): number {
  const [x0, , x1] = enemyBox(e);
  if (hero.x >= x0 && hero.x <= x1) return 0;
  return hero.face > 0 ? x0 - hero.x : hero.x - x1;
}

/** foes level with her, ahead of her feet, nearest first */
function levelAhead(): Enemy[] {
  return game.enemies
    .filter((e) => e.hp > 0 && gapAhead(e) >= 0 && hero.y - enemyBox(e)[3] < LEVEL)
    .sort((a, b) => gapAhead(a) - gapAhead(b));
}

/** the nearest foe ahead stands past the thrust's reach and within the ground lash's */
export function foeFar(): boolean {
  const near = levelAhead()[0];
  if (!near) return false;
  const gap = gapAhead(near);
  const reach = haftReach();
  return gap > THRUST_REACH + reach && gap <= LASH_REACH + reach;
}

/** foes level with her within this many pixels ahead */
export const foesInFront = (within: number): number => levelAhead().filter((e) => gapAhead(e) <= within).length;
