import { dealDamage } from "../../game/damage";
import { withBuild } from "../../game/skills/query";
import { hero, progress } from "../../game/state";
import type { HeroSource } from "../../types/build";
import type { DrillProfile } from "../../types/drill";
import type { Enemy } from "../../types/enemy";
import type { HitLook } from "../../types/hit";

export function strikeEnemy(
  profile: DrillProfile,
  enemy: Enemy,
  damage: number,
  fromX: number,
  source: HeroSource,
  heavy = false,
  finisher = false,
  keen = false,
  look?: HitLook,
): boolean {
  if (enemy.hp <= 0) {
    return false;
  }
  const { ad, ap } = progress.stats;
  const power = source === "attacks" ? ad : ap;
  return (
    dealDamage(enemy, (damage / profile.attack) * power, {
      fromX,
      source,
      melee: source === "attacks",
      heavy: heavy || (source === "attacks" && hero.riposte > 0),
      finisher,
      sureCrit: keen,
      look,
    }) === "hit"
  );
}

export function freezeEnemy(enemy: Enemy, duration: number): void {
  if (enemy.hp > 0 && duration > 0) {
    enemy.frozen = Math.max(enemy.frozen, withBuild("duration", duration));
  }
}
