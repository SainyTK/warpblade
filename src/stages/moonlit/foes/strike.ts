import { eachStanding, heroSlot } from "../../../game/coopHooks";
import { enemyBox } from "../../../game/enemies/enemy";
import { hurtHero } from "../../../game/hurtHero";
import { boxHit, heroBox } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { Box } from "../../../types/world";

const struck = new WeakMap<Enemy, Set<number>>();

export function freshStrike(e: Enemy): void {
  struck.set(e, new Set());
}

export function strikeOnce(e: Enemy, box: Box, damage: number): void {
  const hit = struck.get(e) ?? new Set<number>();
  struck.set(e, hit);
  eachStanding(() => {
    if (hit.has(heroSlot()) || !boxHit(box, heroBox())) return;
    hit.add(heroSlot());
    hurtHero(damage, e.x);
  });
}

export function touchHero(e: Enemy, damage: number): void {
  if (e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(damage, e.x);
  });
}

export const reachBox = (e: Enemy, from: number, to: number, top: number, bottom: number): Box => {
  const a = e.x + e.face * from;
  const b = e.x + e.face * to;
  return [Math.min(a, b), e.y + top, Math.max(a, b), e.y + bottom];
};

export const hurting = (e: Enemy): boolean => e.stagger > 0 || e.stun > 0 || e.air;
