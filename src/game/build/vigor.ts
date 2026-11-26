import { hero, progress } from "../state";
import { currentBuildStats } from "./stats";

/** Vigor: a standing hero gets a little HP back each second */
export function regenVigor(dt: number): void {
  const regen = currentBuildStats().regen;
  if (!regen || hero.state === "dead" || hero.hp <= 0) return;
  hero.hp = Math.min(progress.stats.hp, hero.hp + regen * dt);
}
