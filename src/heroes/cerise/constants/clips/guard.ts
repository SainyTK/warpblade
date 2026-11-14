import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";

/** the fencer's high guard: side on and sunk a little, the rapier raised point up across the face, the off hand back */
const HOLD = pose({
  hx: -1.5,
  hy: -12.8,
  nx: -0.5,
  ny: -22.8,
  cb: 0.2,
  fx: 6.5,
  fy: -20.5,
  sa: -1.2,
  bx: -6.5,
  by: -22.5,
  ffx: 6,
  bfx: -5.5,
  ba: 0.3,
});
const t = GUARD_TIMES;

/**
 * Cerise's guard in the shared segments: the blade snapped up across her face; the held guard breathing; a block that
 * drives her back onto the rear foot with the blade bent toward her; and the parry, the point whipped down and out
 * across the line, which the riposte rides.
 */
export const CERISE_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ ...HOLD, fx: 7.5, fy: -18, sa: -0.3 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), pose({ ...HOLD, ny: -22.4, fy: -20.8, by: -22.8 })],
    [frame(32), pose({ ...HOLD, ny: -22.9, fy: -20.4, sa: -1.17 })],
    [t.loopTo - 0.001, HOLD],
    [
      t.block,
      pose({ ...HOLD, hx: -3, nx: -2.5, ny: -22.3, cb: -0.5, fx: 4.5, fy: -20, sa: -1.45, bfx: -7, ba: 0.6 }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -2.3, nx: -1.5, fx: 5.5, sa: -1.32, bfx: -6.5, ba: 0.45 })],
    [t.blockEnd - 0.001, HOLD],
    [
      t.parry,
      pose({ ...HOLD, hx: 0, nx: 2.5, ny: -23, fx: 11, fy: -20.5, sa: -0.45, bx: -7.5, by: -21, ffx: 7 }),
      "snap",
    ],
    [
      t.parry + frame(3),
      pose({ ...HOLD, hx: 0.3, nx: 3, ny: -23, fx: 11.5, fy: -20, sa: -0.3, bx: -7.5, by: -20.5, ffx: 7 }),
    ],
    [t.parryEnd, HOLD],
  ],
};
