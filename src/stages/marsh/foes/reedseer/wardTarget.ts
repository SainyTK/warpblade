import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { WARD } from "./constants";

const warded = new WeakSet<Enemy>();

export const isWarded = (e: Enemy): boolean => warded.has(e);

export function markWarded(e: Enemy, on: boolean): void {
  if (on) warded.add(e);
  else warded.delete(e);
}

export function wardTarget(seer: Enemy): Enemy | null {
  let best: Enemy | null = null;
  let bestGap: number = WARD.reach;
  for (const other of game.enemies) {
    if (other === seer || other.hp <= 0 || other.rank !== "minion" || warded.has(other)) continue;
    const gap = Math.hypot(other.x - seer.x, other.y - seer.y);
    if (gap >= bestGap) continue;
    best = other;
    bestGap = gap;
  }
  return best;
}
