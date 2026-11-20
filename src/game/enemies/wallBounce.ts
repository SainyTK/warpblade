import { WALL_BOUNCE } from "../../constants/combo";
import { ENEMIES } from "../../constants/enemies";
import type { Enemy } from "../../types/enemy";
import { stageLeft, stageRight } from "../adventure";
import { dust, shake } from "../world";
import { launchEnemy } from "./airborne";

/** a foe driven into the edge of the stage bounces back off the wall and up into the air */
export function wallBounce(e: Enemy, dir: number): void {
  if (e.hp <= 0 || !ENEMIES[e.type].launchable) return;
  const gap = dir > 0 ? stageRight() - e.x : e.x - stageLeft();
  if (gap > WALL_BOUNCE.near) return;
  launchEnemy(e, WALL_BOUNCE.launch);
  e.vx = -dir * WALL_BOUNCE.back;
  dust(dir > 0 ? stageRight() - 4 : stageLeft() + 4, e.y, 5, -dir);
  shake(0.15, 2);
}
