import type { HitOptions } from "../../../../game/damage";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";

export function skillStrike(foe: Enemy, power: number, source: string, options: HitOptions = {}): void {
  if (foe.hp > 0 && power > 0) {
    dealDamage(foe, progress.stats.ad * power, { fromX: hero.x, source, ...options });
  }
}

export function foesNear(x: number, y: number, radius: number): Enemy[] {
  return game.enemies.filter((foe) => {
    const [fx, fy] = enemyCenter(foe);
    return foe.hp > 0 && Math.hypot(fx - x, fy - y) <= radius;
  });
}

export function foesAhead(x: number, y: number, face: number, reach: number, height: number): Enemy[] {
  return game.enemies.filter((foe) => {
    const ahead = (foe.x - x) * face;
    return foe.hp > 0 && ahead >= -6 && ahead <= reach && Math.abs(foe.y - y) <= height;
  });
}
