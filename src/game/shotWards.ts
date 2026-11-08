import type { Point } from "../types/world";

/**
 * A ward that breaks foe projectiles: a circle round a point, held up by the effect that made it (Orrin's Whirlwall).
 * Each foe projectile asks `shotWarded` every step and is gone when it says yes; the ward answers with its own sparks.
 */
export interface ShotWard {
  at(): Point;
  radius: number;
  /** a shot broke on the ward here */
  broke(x: number, y: number): void;
}

const wards = new Set<ShotWard>();

/** hold a ward up until `lowerWard` is called with it */
export function raiseWard(w: ShotWard): void {
  wards.add(w);
}

export function lowerWard(w: ShotWard): void {
  wards.delete(w);
}

/** a new run: no ward stands */
export function clearWards(): void {
  wards.clear();
}

/** a foe projectile at this point meets a ward and breaks on it */
export function shotWarded(x: number, y: number): boolean {
  for (const w of wards) {
    const c = w.at();
    if (Math.hypot(x - c.x, y - c.y) > w.radius) continue;
    w.broke(x, y);
    return true;
  }
  return false;
}
