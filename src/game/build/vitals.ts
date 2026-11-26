import { DRAIN_FLOOR } from "../../constants/vitals";
import { hero, progress } from "../state";

function drainedHp(hp: number, change: number): number {
  if (change >= 0) return Math.min(progress.stats.hp, hp + change);
  if (hp <= DRAIN_FLOOR) return hp;
  return Math.max(DRAIN_FLOOR, hp + change);
}

export function tickVitals(dt: number): void {
  if (hero.state === "dead" || hero.hp <= 0) return;
  if (progress.hpPerSecond) hero.hp = drainedHp(hero.hp, progress.hpPerSecond * dt);
  if (progress.mpPerSecond) hero.mp = Math.max(0, Math.min(progress.stats.mp, hero.mp + progress.mpPerSecond * dt));
}
