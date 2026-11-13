import type { ActionClip } from "../../types/pose";
import { GUARD_TIMES } from "../combat";
import { frame, pose } from "../hero";

/** Kael's guard: sunk a little, both hands on the hilt at his chest, the crystal blade raised across his face with its
 *  point up and back over his shoulder, so a blow from the front meets the flat of it */
const HOLD = {
  hx: -1,
  hy: -12.5,
  cb: 0.5,
  nx: 1.5,
  ny: -22.5,
  fx: 5.5,
  fy: -19.5,
  bx: 6.5,
  by: -17.5,
  sa: -2.2,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const t = GUARD_TIMES;

/**
 * Kael's guard in the shared segments: the blade snapped up across him; the held guard breathing; the jolt of a block,
 * driven back onto the rear foot with the blade pressed toward him; and the parry, the blade whipped forward and out to
 * throw the blow aside, a cut that the riposte rides.
 */
export const KAEL_GUARD_CLIP = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -15, bx: 5, by: -14, sa: -0.9, ffx: 4, bfx: -5 })],
    [t.loopFrom, pose(HOLD), "snap"],
    [frame(16), pose({ ...HOLD, ny: -23, cb: 1, fy: -20, by: -18 })],
    [frame(32), pose({ ...HOLD, hy: -12, ny: -22.5, cb: 0.5, sa: -2.15 })],
    [t.loopTo - 0.001, pose(HOLD)],
    [
      t.block,
      pose({
        ...HOLD,
        hx: -2.5,
        cb: -0.5,
        nx: -0.5,
        ny: -22,
        fx: 4,
        fy: -19,
        bx: 5,
        by: -17,
        sa: -2.35,
        bfx: -7,
        ba: 0.6,
      }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -2, nx: 0.5, fx: 5, bx: 6, sa: -2.28, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, pose(HOLD)],
    [t.parry, pose({ ...HOLD, hy: -13, nx: 3, ny: -23, fx: 9.5, fy: -21, bx: 8, by: -19, sa: -1.1, ffx: 7.5 }), "snap"],
    [
      t.parry + frame(3),
      pose({
        ...HOLD,
        hy: -13.5,
        cb: -0.5,
        nx: 3.5,
        ny: -23.5,
        fx: 10,
        fy: -19,
        bx: 8.5,
        by: -17.5,
        sa: -0.45,
        ffx: 8,
      }),
    ],
    [
      t.parry + frame(8),
      pose({ ...HOLD, hy: -13, nx: 2.5, ny: -23, fx: 8, fy: -19.5, bx: 7.5, by: -18, sa: -1.4, ffx: 7 }),
    ],
    [t.parryEnd, pose(HOLD)],
  ],
} satisfies ActionClip;
