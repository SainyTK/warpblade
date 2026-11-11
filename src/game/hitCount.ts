import { HIT_COUNT } from "../constants/combat";
import { hero } from "./state";

/** one more hit of the hero's own in a row */
export function countHit(): void {
  hero.hitCount++;
  hero.hitIdle = 0;
}

/** the row of hits is lost: the hero was hurt */
export function loseHitCount(): void {
  hero.hitCount = 0;
}

/** the row of hits ends after a while without one */
export function updateHitCount(dt: number): void {
  if (!hero.hitCount) return;
  hero.hitIdle += dt;
  if (hero.hitIdle > HIT_COUNT.window) hero.hitCount = 0;
}
