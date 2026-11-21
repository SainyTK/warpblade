import { drillFighter } from "../../../../drill";
import type { HitOptions } from "../../../../game/damage";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";

export const fighterAt = (): { x: number; y: number; face: number } => drillFighter() ?? hero;

export function skillStrike(foe: Enemy, power: number, source: string, options: HitOptions = {}): void {
  if (foe.hp > 0 && power > 0) {
    dealDamage(foe, progress.stats.ad * power, { fromX: fighterAt().x, source, ...options });
  }
}

export function spellStrike(foe: Enemy, power: number, source: string): void {
  if (foe.hp > 0 && power > 0) {
    dealDamage(foe, progress.stats.ap * power, { fromX: fighterAt().x, source });
  }
}

export function isBehind(foe: Enemy): boolean {
  const { x, face } = fighterAt();
  return Math.sign(foe.x - x) === -face;
}

export function foesNear(x: number, y: number, radius: number): Enemy[] {
  return game.enemies.filter((foe) => {
    const [fx, fy] = enemyCenter(foe);
    return foe.hp > 0 && Math.hypot(fx - x, fy - y) <= radius;
  });
}

export function foesAround(reach: number, height: number): Enemy[] {
  const { x, y } = fighterAt();
  return game.enemies.filter((foe) => foe.hp > 0 && Math.abs(foe.x - x) <= reach && Math.abs(foe.y - y) <= height);
}

export function blindMinion(foe: Enemy, seconds: number): void {
  if (foe.rank === "minion" && seconds > 0) {
    foe.blind = Math.max(foe.blind, seconds);
  }
}

export function pullFoe(foe: Enemy, distance: number): void {
  const gap = fighterAt().x - foe.x;
  foe.x += Math.sign(gap) * Math.max(0, Math.min(Math.abs(gap) - 10, distance));
}

export const swingKind = () => drillFighter()?.swing?.kind ?? null;

export const keenSwing = (): boolean => !!drillFighter()?.swing?.keen;

export const arriving = (): boolean => drillFighter()?.warp?.phase === "arrival";
