import type { HitOptions } from "../../../../game/damage";
import { dealDamage } from "../../../../game/damage";
import { hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";

export function attackStrike(foe: Enemy, power: number, source: string, options: HitOptions = {}): void {
  if (foe.hp > 0 && power > 0) {
    dealDamage(foe, progress.stats.ad * power, { fromX: hero.x, source, ...options });
  }
}

export function abilityStrike(foe: Enemy, power: number, source: string, options: HitOptions = {}): void {
  if (foe.hp > 0 && power > 0) {
    dealDamage(foe, progress.stats.ap * power, { fromX: hero.x, source, ...options });
  }
}
