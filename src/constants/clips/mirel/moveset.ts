import type { ActionClip, Pose } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { m, onShaft, STANCE } from "./stance";

/**
 * Her poses for the moves every hero shares: the staff flung like a pendulum, the arrival out of skipped time with the
 * staff already sweeping down, and the guard with the staff held upright before her in both hands.
 */

/** J held: the staff drawn back over her shoulder, then flung out level as the arm snaps straight */
export const THROW_CLIP: ActionClip = {
  dur: 0.15,
  hit: 0.1,
  keys: [
    [0, STANCE],
    [frame(1), m({ nx: -0.5, cb: -0.8, fx: -1, fy: -24, sa: -2.5, bx: 3, by: -18, ffx: 4, bfx: -3 })],
    [
      frame(2),
      m({
        hx: -1,
        nx: -1.5,
        ny: -23.5,
        cb: -1.3,
        fx: -4,
        fy: -26,
        sa: -2.8,
        bx: 4,
        by: -19,
        ffx: 4.5,
        bfx: -4,
        ba: 0.3,
      }),
    ],
    [
      frame(3),
      m({ hx: 1, nx: 3, ny: -23, cb: 1, fx: 13, fy: -21, sa: -0.3, bx: -4, by: -18, be: 0, ffx: 6, bfx: -4, ba: 0.2 }),
      "snap",
    ],
    [
      0.15,
      m({ hx: 1, nx: 3, ny: -23, cb: 0.9, fx: 12.5, fy: -20.5, sa: -0.3, bx: -4, by: -18, be: 0, ffx: 6, bfx: -4 }),
    ],
  ],
};

/** the arrival's blow, the frame the echo copies: the staff swept down through the foe in both hands, her weight over it */
const ARRIVAL_CUT: Pose = m({
  hx: 1.5,
  hy: -12,
  nx: 4,
  ny: -22,
  cb: 1.2,
  fx: 12,
  fy: -17,
  sa: 0.25,
  ...onShaft(12, -17, 0.25, -6),
  be: 0,
  ffx: 8,
  bfx: -6,
  ba: 0.3,
});

/** she is simply there, the staff high and already falling, then the sweep down through the foe and a step home */
export const ARRIVAL_CLIP: ActionClip = {
  dur: 0.4,
  hit: frame(1),
  keys: [
    [0, m({ hy: -13, nx: 2, cb: 0.6, fx: 8, fy: -27, sa: -2, bx: 5, by: -24, be: 0, ffx: 7, bfx: -5 })],
    [frame(1), ARRIVAL_CUT, "snap"],
    [frame(4), { ...ARRIVAL_CUT, fx: 12.5, fy: -16.5, sa: 0.32, bx: 6.6, by: -18.9 }],
    [frame(8), m({ hy: -13, nx: 2, cb: 0.5, fx: 9, fy: -18, sa: -0.9, bx: 5, by: -17, ffx: 5, bfx: -4 })],
    [0.4, STANCE],
  ],
};

/** the held guard: sunk a little, the staff upright before her in both hands, its clock ring at her brow */
const HOLD: Pose = m({
  hx: -1,
  hy: -13,
  nx: 1,
  ny: -23,
  cb: 0.4,
  fx: 7,
  fy: -20,
  fe: 0,
  sa: -1.62,
  ...onShaft(7, -20, -1.62, -7),
  be: 0,
  ffx: 5,
  bfx: -5,
  ba: 0.3,
});
const t = GUARD_TIMES;

/**
 * K, in the shared guard's segments: the staff snapped upright before her; the held guard breathing; the jolt of a
 * block, driven back onto the rear foot with the staff tipped toward her; and the Stopped Moment, the staff thrust out
 * with its ring held up to the attacker like a clock shown to it.
 */
export const GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, m({ hy: -13.5, fx: 6.5, fy: -17, sa: -1.5, ffx: 4, bfx: -4 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), { ...HOLD, ny: -22.7, cb: 0.6, fy: -19.6, by: -12.7 }],
    [frame(32), { ...HOLD, hy: -12.7, ny: -22.8, sa: -1.6 }],
    [t.loopTo - 0.001, HOLD],
    [
      t.block,
      {
        ...HOLD,
        hx: -2.5,
        nx: -0.5,
        cb: -0.4,
        fx: 5,
        fy: -19.5,
        sa: -1.85,
        ...onShaft(5, -19.5, -1.85, -7),
        bfx: -6.5,
        ba: 0.5,
      },
      "snap",
    ],
    [t.block + frame(3), { ...HOLD, hx: -2, fx: 6, sa: -1.72, ...onShaft(6, -20, -1.72, -7), bfx: -6 }],
    [t.blockEnd - 0.001, HOLD],
    [
      t.parry,
      m({
        hx: 0.5,
        hy: -13,
        nx: 3,
        ny: -23,
        cb: 1,
        fx: 11,
        fy: -23,
        sa: -1.1,
        bx: 6,
        by: -20,
        be: 0,
        ffx: 6.5,
        bfx: -5,
      }),
      "snap",
    ],
    [
      t.parry + frame(3),
      m({
        hx: 0.5,
        hy: -13,
        nx: 3,
        ny: -23.2,
        cb: 1,
        fx: 11.5,
        fy: -24,
        sa: -1.2,
        bx: 6,
        by: -20.5,
        ffx: 6.5,
        bfx: -5,
      }),
    ],
    [t.parry + frame(8), { ...HOLD, nx: 2, fx: 9, fy: -21.5, sa: -1.4, ...onShaft(9, -21.5, -1.4, -7) }],
    [t.parryEnd, HOLD],
  ],
};
