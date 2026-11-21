import { dealDamage } from "../../game/damage";
import { withCharms } from "../../game/skills/query";
import { hero, progress } from "../../game/state";
import type { HeroSource } from "../../types/build";
import type { Enemy } from "../../types/enemy";
import { TRAINING_ATTACK_DAMAGE } from "../constants";

export function strikeEnemy(
  enemy: Enemy,
  damage: number,
  fromX: number,
  source: HeroSource,
  heavy = false,
  finisher = false,
): boolean {
  if (enemy.hp <= 0) {
    return false;
  }
  const { ad, ap } = progress.stats;
  const power = source === "attacks" ? ad : ap;
  return (
    dealDamage(enemy, (damage / TRAINING_ATTACK_DAMAGE) * power, {
      fromX,
      source,
      melee: source === "attacks",
      heavy: heavy || (source === "attacks" && hero.riposte > 0),
      finisher,
    }) === "hit"
  );
}

export function freezeEnemy(enemy: Enemy, duration: number): void {
  if (enemy.hp > 0) {
    enemy.frozen = Math.max(enemy.frozen, withCharms("duration", duration));
  }
}
