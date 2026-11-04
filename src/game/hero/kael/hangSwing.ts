import { HANG_SWING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";

/**
 * The catch on a crystal: the body arrives still carrying the warp's sweep, swings under the hand and settles into the
 * hang's own slow sway. The swing pivots on the hand, so the feet travel farthest and the hips half as far.
 */
export function hangSwing(h: Hero, p: Pose): Pose {
  if (h.state !== "hang") return p;
  const s = HANG_SWING;
  const reach = s.amplitude * Math.exp(-h.st / s.settle) * Math.sin((2 * Math.PI * h.st) / s.period);
  if (Math.abs(reach) < 0.05) return p;
  return { ...p, ffx: p.ffx + reach, bfx: p.bfx + reach, hx: p.hx + reach * 0.5 };
}
