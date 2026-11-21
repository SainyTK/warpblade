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

export function foesAlong(from: number, to: number): Enemy[] {
  const near = (foe: Enemy) => {
    const ahead = (foe.x - hero.x) * hero.face;
    return foe.hp > 0 && ahead >= from && ahead <= to && Math.abs(foe.y - hero.y) <= 40;
  };
  return game.enemies.filter(near);
}

export const cutAngle = (foe: Enemy): number => (foe.x > hero.x ? -0.35 : 0.35) + (foe.hp % 7) * 0.08;
