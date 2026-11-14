import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { SAYA_POSES } from "./poses";

const HOLD = SAYA_POSES.guard;
const t = GUARD_TIMES;

/**
 * Saya's guard in the shared segments: the sheathed katana swept up across her in both hands; the held guard
 * breathing; the jolt of a block, pushed back onto the rear foot with the lacquer pressed toward her; and the parry,
 * the hilt thrust forward to turn the blow aside, which the counter draw cuts out of.
 */
export const SAYA_GUARD_CLIP = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ ...SAYA_POSES.rest, fx: 5.6, fy: -16, bx: 4, by: -16 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), pose({ ...HOLD, ny: -22.2, cb: 0.9, fy: -19.8, by: -22.4 })],
    [frame(32), pose({ ...HOLD, hy: -12.2, ny: -22.4 })],
    [t.loopTo - 0.001, HOLD],
    [
      t.block,
      pose({
        ...HOLD,
        hx: -2.4,
        cb: -0.4,
        nx: -0.6,
        ny: -22,
        fx: 5.6,
        fy: -19,
        bx: 0,
        by: -21.4,
        sa: -2.7,
        bfx: -6.5,
        ba: 0.6,
      }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -1.8, nx: 0.4, fx: 6.6, bx: 0.8, sa: -2.62, bfx: -6.2, ba: 0.5 })],
    [t.blockEnd - 0.001, HOLD],
    [
      t.parry,
      pose({ ...HOLD, hy: -13, nx: 3, ny: -23, fx: 10, fy: -20.5, bx: 4.5, by: -22.5, sa: -2.4, ffx: 7.5 }),
      "snap",
    ],
    [t.parry + frame(4), pose({ ...HOLD, nx: 2.2, fx: 9, fy: -20, bx: 3.4, by: -22.4, ffx: 7 })],
    [t.parryEnd, HOLD],
  ],
} satisfies ActionClip;
