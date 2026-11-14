import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";

/** Yun's guard: sunk a little, the jian held upright before his face with its point up, the sword fingers laid along
 *  its flat, so the spirit swords fan out before him beside it */
const HOLD = {
  hx: -1,
  hy: -12.8,
  cb: 0.3,
  nx: 1,
  ny: -22.8,
  fx: 6.5,
  fy: -17.5,
  sa: -1.45,
  bx: 7,
  by: -21.5,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const t = GUARD_TIMES;

/**
 * Yun's guard in the shared segments: the jian swept up before him; the held guard breathing; the jolt of a block,
 * driven onto the back foot with the blade pressed toward him; and the parry, the blade flicked forward and down as the
 * sword fingers push out, the moment the qi wave leaves it.
 */
export const YUN_GUARD_CLIP = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ hy: -13.5, nx: 0.5, ny: -23.5, fx: 7, fy: -16, sa: 0.3, bx: 4.5, by: -21, ffx: 4.5, bfx: -4 })],
    [t.loopFrom, pose(HOLD), "snap"],
    [frame(16), pose({ ...HOLD, ny: -23.2, cb: 0.7, fy: -17.9, by: -21.9 })],
    [frame(32), pose({ ...HOLD, hy: -12.5, ny: -22.6, sa: -1.4 })],
    [t.loopTo - 0.001, pose(HOLD)],
    [
      t.block,
      pose({
        ...HOLD,
        hx: -2.5,
        cb: -0.6,
        nx: -1,
        ny: -22.2,
        fx: 4.5,
        fy: -17,
        bx: 5,
        by: -21,
        sa: -1.65,
        bfx: -7,
        ba: 0.6,
      }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -2, nx: 0, fx: 5.5, bx: 6, sa: -1.55, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, pose(HOLD)],
    [t.parry, pose({ ...HOLD, hy: -13, nx: 3, ny: -23, fx: 11, fy: -19, sa: -0.35, bx: 12, by: -22, ffx: 8 }), "snap"],
    [
      t.parry + frame(3),
      pose({
        ...HOLD,
        hy: -13.4,
        cb: -0.4,
        nx: 3.5,
        ny: -23.4,
        fx: 11.5,
        fy: -17,
        sa: 0.1,
        bx: 12.5,
        by: -21.5,
        ffx: 8,
      }),
    ],
    [
      t.parry + frame(8),
      pose({ ...HOLD, hy: -13, nx: 2, ny: -23, fx: 8.5, fy: -17.5, sa: -0.9, bx: 9, by: -21.5, ffx: 7 }),
    ],
    [t.parryEnd, pose(HOLD)],
  ],
} satisfies ActionClip;
