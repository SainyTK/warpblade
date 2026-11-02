import { WORLD_COLORS } from "../constants/palette";
import { GROUND, PLATFORMS } from "../constants/stage";
import { PK } from "../types/particle";
import type { Box } from "../types/world";
import { game, hero, particles, rng } from "./state";

const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** the top of the highest floor at x that is at or below y */
export function surfaceBelow(x: number, y: number): number {
  let best = GROUND;
  for (const p of PLATFORMS) if (x >= p.x0 && x <= p.x1 && p.y >= y - 2 && p.y < best) best = p.y;
  return best;
}
export const boxHit = (a: Box, b: Box): boolean => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
export const heroBox = (): Box => [hero.x - 5, hero.y - 32, hero.x + 5, hero.y];
/** a box in front of the hero, in pixels from the feet as if facing right */
export function boxAhead(x0: number, y0: number, x1: number, y1: number): Box {
  return hero.face > 0
    ? [hero.x + x0, hero.y + y0, hero.x + x1, hero.y + y1]
    : [hero.x - x1, hero.y + y0, hero.x - x0, hero.y + y1];
}
/** the same box mirrored behind the hero */
export function boxBehind(x0: number, y0: number, x1: number, y1: number): Box {
  const [ax0, ay0, ax1, ay1] = boxAhead(x0, y0, x1, y1);
  return [2 * hero.x - ax1, ay0, 2 * hero.x - ax0, ay1];
}
export function shake(time: number, amp: number): void {
  if (REDUCED_MOTION) return;
  game.shake = Math.max(game.shake, time);
  game.amp = Math.max(game.amp, amp);
}
export function hitStop(time: number): void {
  game.freeze = Math.max(game.freeze, time);
}
export function dust(x: number, y: number, n: number, dir = 0): void {
  const R = rng;
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.DUST,
      x + R.range(-3, 3),
      y - R.range(0, 2),
      (dir || R.range(-1, 1)) * R.range(10, 50),
      -R.range(4, 22),
      R.range(0.35, 0.7),
      {
        col: WORLD_COLORS.dust,
        size: R.range(1.6, 3.2),
      },
    );
}
