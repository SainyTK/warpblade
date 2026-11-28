import { SURGE } from "../../constants/campaign";
import type { Enemy } from "../../types/enemy";
import { kindOf } from "../enemies/kinds";

export function drawStragglersDown(foes: readonly Enemy[], dt: number): void {
  for (const enemy of foes) {
    if (enemy.hp <= 0 || enemy.air || !kindOf(enemy.type).flies || enemy.y >= SURGE.reachableY) continue;
    enemy.y = Math.min(SURGE.reachableY, enemy.y + SURGE.stragglerSink * dt);
  }
}
