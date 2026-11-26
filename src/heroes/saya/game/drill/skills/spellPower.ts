import { dealDamage } from "../../../../../game/damage";
import { hero, progress } from "../../../../../game/state";
import type { DrillSpell } from "../../../../../types/drill";
import type { Enemy } from "../../../../../types/enemy";

export function spellBonus(foe: Enemy, spell: DrillSpell, share: number, source: string): void {
  if (foe.hp > 0 && share > 0) {
    dealDamage(foe, (spell.damage / 10) * progress.stats.ap * share, { fromX: hero.x, source });
  }
}
