import { GUARD_TIMES } from "../../../../constants/combat";
import { frame } from "../../../../constants/hero";
import type { ActionClip, Pose } from "../../../../types/pose";
import { vp } from "./stance";

/** the guard: both blades crossed before her chest, the long blade's point up and back, the short blade across it */
const HOLD: Pose = vp({
  hx: -1,
  hy: -12.5,
  cb: 0.4,
  nx: 1,
  ny: -22.5,
  fx: 6,
  fy: -19,
  sa: -2,
  bx: 7,
  by: -18,
  oa: -0.9,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
});
const hold = (o: Partial<Pose>): Pose => ({ ...HOLD, ...o });
const t = GUARD_TIMES;

/**
 * Her guard in the shared segments: the blades snapped into a cross; the held cross breathing; a block jolting her back
 * onto the rear foot with the cross pressed in; and the parry, the short blade sweeping out and down to turn the blow
 * aside while the long blade draws back, ready to cut.
 */
export const GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, vp({ hy: -13, fx: 7, fy: -16, sa: -0.6, bx: 3, by: -16, oa: 0.4, ffx: 5, bfx: -5 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), hold({ ny: -22.8, cb: 0.8, fy: -19.5, by: -18.5 })],
    [frame(32), hold({ hy: -12.2, ny: -22.2, sa: -1.95, oa: -0.95 })],
    [t.loopTo - 0.001, HOLD],
    [
      t.block,
      hold({ hx: -2.5, nx: -1, ny: -22, cb: -0.5, fx: 4.5, bx: 5.5, sa: -2.2, oa: -1.1, bfx: -7, ba: 0.6 }),
      "snap",
    ],
    [t.block + frame(3), hold({ hx: -2, nx: 0, fx: 5, bx: 6.5, sa: -2.1, oa: -1, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, HOLD],
    [
      t.parry,
      hold({ hy: -12.8, nx: 3, ny: -22.8, cb: 0.8, fx: 2, fy: -21, sa: -2.5, bx: 12, by: -15, oa: 0.7, ffx: 8 }),
      "snap",
    ],
    [
      t.parry + frame(3),
      hold({ hy: -13, nx: 3.5, ny: -23, cb: 1, fx: 1.5, fy: -21.5, sa: -2.6, bx: 12.5, by: -13.5, oa: 1, ffx: 8 }),
    ],
    [
      t.parry + frame(7),
      hold({ hy: -12.8, nx: 2.5, ny: -22.8, cb: 0.6, fx: 4, fy: -20, sa: -2.2, bx: 9, by: -16, oa: 0.2, ffx: 7 }),
    ],
    [t.parryEnd, HOLD],
  ],
};
