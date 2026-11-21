import { hero, progress } from "../../../../../game/state";

export function heal(amount: number): void {
  if (amount > 0) {
    hero.hp = Math.min(progress.stats.hp, hero.hp + amount);
  }
}
