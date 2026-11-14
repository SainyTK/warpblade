import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";

/** the guard: sunk into a wide stance, the blade upright in front with its spine out and the far palm braced on its back */
const HOLD = {
  hx: -1,
  hy: -12.6,
  cb: 0.4,
  nx: 1,
  ny: -22.6,
  fx: 6,
  fy: -17.5,
  sa: -1.4,
  bx: 7.5,
  by: -21,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
/** the counter shot: the blade swung level at the attacker, both hands on it */
const AIM = { ...HOLD, hy: -13, nx: 3, ny: -23, fx: 10.5, fy: -19, sa: -0.05, bx: 8.5, by: -18.5, ffx: 7.5 } as const;
const t = GUARD_TIMES;

/**
 * Calder's guard in the shared segments: the blade swung up in front of him; the held guard breathing; a block that
 * drives him back onto the rear foot with the spine pressed toward him; and the parry, the blade snapped level at the
 * attacker as the round goes off, the muzzle kicking up, and a settle back into the guard.
 */
export const CALDER_GUARD_CLIP = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -17, bx: 4, by: -17, sa: -0.6, ffx: 4, bfx: -5 })],
    [t.loopFrom, pose(HOLD), "snap"],
    [frame(16), pose({ ...HOLD, ny: -23, cb: 0.8, fy: -18, by: -21.5 })],
    [frame(32), pose({ ...HOLD, hy: -12.2, ny: -22.4, sa: -1.36 })],
    [t.loopTo - 0.001, pose(HOLD)],
    [
      t.block,
      pose({
        ...HOLD,
        hx: -2.6,
        cb: -0.6,
        nx: -0.6,
        ny: -22,
        fx: 4.5,
        fy: -17,
        bx: 5.5,
        by: -20.5,
        sa: -1.55,
        bfx: -7,
        ba: 0.6,
      }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -2, nx: 0.3, fx: 5.2, bx: 6.6, sa: -1.48, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, pose(HOLD)],
    [t.parry, pose(AIM), "snap"],
    [
      t.parry + frame(2),
      pose({ ...AIM, hx: -2, cb: -1, nx: 1, fx: 8, fy: -20.5, sa: -0.5, bx: 6.5, by: -19.5, bfx: -6.8 }),
    ],
    [t.parry + frame(5), pose({ ...AIM, hx: -1.6, nx: 1.6, fx: 8.6, fy: -20, sa: -0.3, bx: 7, by: -19 })],
    [t.parryEnd, pose(HOLD)],
  ],
} satisfies ActionClip;
