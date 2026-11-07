import { buildStats } from "../../utils/build";
import { hero, progress } from "../state";

/** Vigor: a standing hero gets a little HP back each second */
export function regenVigor(dt: number): void {
  const regen = buildStats(progress.build).regen;
  if (!regen || hero.state === "dead" || hero.hp <= 0) return;
  hero.hp = Math.min(progress.stats.hp, hero.hp + regen * dt);
}
