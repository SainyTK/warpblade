import type { Enemy } from "../../../../types/enemy";

const small = new WeakSet<Enemy>();

export const SMALL_SCALE = 0.62;

export function makeSmall(e: Enemy): void {
  small.add(e);
}

export const isSmall = (e: Enemy): boolean => small.has(e);

export const slagScale = (e: Enemy): number => (small.has(e) ? SMALL_SCALE : 1);
