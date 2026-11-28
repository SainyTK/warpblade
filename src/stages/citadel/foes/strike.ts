import { eachStanding, heroSlot } from "../../../game/coopHooks";
import { enemyBox } from "../../../game/enemies/enemy";
import { hurtHero } from "../../../game/hurtHero";
import { boxHit, heroBox } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { Box } from "../../../types/world";

export function strikeHero(box: Box, damage: number, fromX: number): void {
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(damage, fromX);
  });
}

export function strikeOnce(struck: Set<number>, box: Box, damage: number, fromX: number): void {
  eachStanding(() => {
    if (struck.has(heroSlot()) || !boxHit(box, heroBox())) return;
    struck.add(heroSlot());
    hurtHero(damage, fromX);
  });
}

export function touchHero(e: Enemy, damage: number): void {
  if (e.halt > 0) return;
  strikeHero(enemyBox(e), damage * e.power, e.x);
}

export const boxAheadOf = (e: Enemy, from: number, to: number, top: number, bottom: number): Box => {
  const a = e.x + e.face * from;
  const b = e.x + e.face * to;
  return [Math.min(a, b), top, Math.max(a, b), bottom];
};

export function strikeOnceBy(e: Enemy, box: Box, damage: number): void {
  eachStanding(() => {
    if (e.n !== 0 || !boxHit(box, heroBox())) return;
    e.n = 1;
    hurtHero(damage, e.x);
  });
}
