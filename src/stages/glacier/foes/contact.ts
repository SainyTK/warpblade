import { eachStanding } from "../../../game/coopHooks";
import { enemyBox } from "../../../game/enemies/enemy";
import { hurtHero } from "../../../game/hurtHero";
import { boxHit, heroBox } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";

export function touchHero(e: Enemy, damage: number): void {
  if (e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(damage * e.power, e.x);
  });
}
