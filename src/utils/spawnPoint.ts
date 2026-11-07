import type { Point } from "../types/world";

/**
 * The best of some candidate rift places: first any that keeps `heroGap` from every hero, then the one farthest from the
 * nearest foe or rift already there, so a stream spreads over the stage instead of gathering in one spot.
 */
export function pickSpawn(
  candidates: readonly Point[],
  heroes: readonly number[],
  taken: readonly Point[],
  heroGap: number,
): Point {
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const c of candidates) {
    const nearHero = Math.min(...heroes.map((x) => Math.abs(x - c.x)));
    const nearFoe = Math.min(heroGap, ...taken.map((p) => Math.hypot(p.x - c.x, p.y - c.y)));
    // keeping clear of the heroes outweighs any spread
    const score = (nearHero >= heroGap ? heroGap : nearHero - heroGap * 2) + nearFoe;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}
