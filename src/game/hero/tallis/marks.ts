import type { Enemy } from "../../../types/enemy";
import { tallisHost } from "./memory";

/** a foe Mark of Dusk marks now */
export const isMarked = (e: Enemy): boolean => tallisHost.marks.some((m) => m.foe === e && m.left > 0);

/** mark a foe for a while, or refresh its mark */
export function markDusk(e: Enemy, seconds: number): void {
  const old = tallisHost.marks.find((m) => m.foe === e);
  if (old) old.left = Math.max(old.left, seconds);
  else tallisHost.marks.push({ foe: e, left: seconds });
}

/** marks run out, and those on fallen foes go */
export function tickMarks(dt: number): void {
  for (const m of tallisHost.marks) m.left -= dt;
  tallisHost.marks = tallisHost.marks.filter((m) => m.left > 0 && m.foe.hp > 0);
}

/**
 * Where a hit on this foe comes from, as the damage code reads it: from where the hit really comes, or from the foe's
 * back when the hit counts as from behind (a Drop Stab, a marked foe, Gloaming)
 */
export function strikeFrom(e: Enemy, x: number, fromBehind = false): number {
  return fromBehind || isMarked(e) ? e.x - e.face * 6 : x;
}
