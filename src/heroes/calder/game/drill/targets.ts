import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";

export function foesNear(x: number, y: number, radius: number, skip: readonly Enemy[] = []): Enemy[] {
  return game.enemies.filter((foe) => {
    const [fx, fy] = enemyCenter(foe);
    return foe.hp > 0 && !skip.includes(foe) && Math.hypot(fx - x, fy - y) <= radius;
  });
}

export function foesAhead(reach: number, from = hero.x, face = hero.face): Enemy[] {
  return game.enemies.filter((foe) => {
    const ahead = (foe.x - from) * face;
    return foe.hp > 0 && ahead >= -6 && ahead <= reach && Math.abs(foe.y - hero.y) <= 40;
  });
}
