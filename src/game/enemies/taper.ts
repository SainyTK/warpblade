import type { SpriteCanvas } from "../../engine/sprite";
import { lerp } from "../../utils/math";

/**
 * A horn, claw, limb or tendril from (x0, y0) to (x1, y1) that narrows from radius r0 at the base to r1 at the tip.
 * bend pushes the middle sideways, to the left of the line's direction, so the shape curves.
 */
export function taper(
  s: SpriteCanvas,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r0: number,
  r1: number,
  c: number,
  bend = 0,
): void {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const [nx, ny] = len > 0 ? [(y1 - y0) / len, -(x1 - x0) / len] : [0, 0];
  const n = Math.max(1, Math.ceil(len * 2 * s.res));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const push = bend * 4 * u * (1 - u);
    s.dot(lerp(x0, x1, u) + nx * push, lerp(y0, y1, u) + ny * push, lerp(r0, r1, u), c);
  }
}
