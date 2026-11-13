import type { ActionClip } from "../../types/pose";
import { GUARD_TIMES } from "../combat";
import { frame, pose } from "../hero";

/** the guard: sunk a little, the weapon raised across the body in front, the far hand braced behind it */
const HOLD = {
  hx: -1,
  hy: -12.5,
  cb: 0.5,
  nx: 1.5,
  ny: -22.5,
  fx: 6.5,
  fy: -17,
  bx: 3,
  by: -15,
  sa: -1.25,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const t = GUARD_TIMES;

/**
 * Every hero's guard on the shared rig, in segments: the weapon snapped up into place; the held guard breathing; the jolt
 * of a block, driven back onto the rear foot; and the parry, the weapon whipped out and up to knock the blow aside.
 */
export const GUARD_CLIPS = {
  guard: {
    dur: t.parryEnd,
    hit: 0,
    keys: [
      [0, pose({ hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -15, sa: -0.7, ffx: 4, bfx: -5 })],
      [t.loopFrom, pose(HOLD), "snap"],
      [frame(16), pose({ ...HOLD, ny: -23, cb: 1, fy: -17.5 })],
      [frame(32), pose({ ...HOLD, hy: -12, ny: -22.5, cb: 0.5, sa: -1.2 })],
      [t.loopTo - 0.001, pose(HOLD)],
      [
        t.block,
        pose({ ...HOLD, hx: -2.5, cb: -0.5, nx: -0.5, ny: -22, fx: 4.5, fy: -16.5, sa: -1.4, bfx: -7, ba: 0.6 }),
        "snap",
      ],
      [t.block + frame(3), pose({ ...HOLD, hx: -2, nx: 0.5, fx: 5.5, sa: -1.32, bfx: -7, ba: 0.5 })],
      [t.blockEnd - 0.001, pose(HOLD)],
      [t.parry, pose({ ...HOLD, hy: -13, nx: 3, ny: -23, fx: 9.5, fy: -20, sa: -2.2, ffx: 7 }), "snap"],
      [
        t.parry + frame(3),
        pose({ ...HOLD, hy: -13.5, cb: -0.5, nx: 3, ny: -23.5, fx: 8.5, fy: -23, sa: -2.6, ffx: 7 }),
      ],
      [t.parry + frame(8), pose({ ...HOLD, hy: -13, nx: 2.5, ny: -23, fx: 7.5, fy: -18.5, sa: -1.6, ffx: 6.5 })],
      [t.parryEnd, pose(HOLD)],
    ],
  },
} satisfies Record<string, ActionClip>;
