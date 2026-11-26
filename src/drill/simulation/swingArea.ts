import { enemyBox } from "../../game/enemies/enemy";
import type { Enemy } from "../../types/enemy";

const SWING_BODY = 30;
const SWING_BELOW = 0.5;

export function swingTouches(foe: Enemy, fromX: number, toX: number, feetY: number, height: number): boolean {
  const [left, top, right, bottom] = enemyBox(foe);
  const swingTop = feetY - SWING_BODY - height;
  const swingBottom = feetY + height * SWING_BELOW;
  return right >= Math.min(fromX, toX) && left <= Math.max(fromX, toX) && bottom >= swingTop && top <= swingBottom;
}
