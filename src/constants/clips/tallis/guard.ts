import type { ActionClip } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { s } from "./stance";

/** the guard held: low on bent knees, both knives crossed in reverse grip before his chest, the near one over the far */
const HOLD = {
  hx: -0.5,
  hy: -12,
  nx: 1.5,
  ny: -21.5,
  cb: 0.8,
  fx: 5.5,
  fy: -17,
  fe: 1,
  bx: 6.5,
  by: -18.5,
  be: 0,
  sa: 2.4,
  ffx: 5.5,
  bfx: -5.5,
  ba: 0.25,
} as const;
const t = GUARD_TIMES;

/**
 * His guard on the shared segments: the knives snapped across his chest; the held cross breathing; a block's jolt that
 * drives him back onto the rear foot with the cross pressed in; and Fade, the knives flung apart as he drops into the
 * Veil.
 */
export const TALLIS_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, s({ fx: 6, fy: -16, bx: 5, by: -19 })],
    [t.loopFrom, s(HOLD), "snap"],
    [frame(16), s({ ...HOLD, hy: -11.7, ny: -21.2, fy: -16.8, by: -18.3 })],
    [frame(32), s({ ...HOLD, hy: -12.2, ny: -21.7, sa: 2.45 })],
    [t.loopTo - 0.001, s(HOLD)],
    [
      t.block,
      s({ ...HOLD, hx: -2, cb: -0.4, nx: -0.5, ny: -21, fx: 4, fy: -17.5, bx: 5, by: -19, sa: 2.6, bfx: -7, ba: 0.6 }),
      "snap",
    ],
    [t.block + frame(3), s({ ...HOLD, hx: -1.5, nx: 0.5, fx: 4.8, bx: 5.8, bfx: -6.5, ba: 0.45 })],
    [t.blockEnd - 0.001, s(HOLD)],
    [
      t.parry,
      s({ ...HOLD, hy: -10.5, ny: -19.5, nx: 2, cb: 1.2, fx: 10, fy: -13, fe: 0, sa: 0.9, bx: -2, by: -15, be: 1 }),
      "snap",
    ],
    [
      t.parry + frame(3),
      s({ ...HOLD, hy: -10, ny: -19, nx: 2, cb: 1.3, fx: 10.5, fy: -12, fe: 0, sa: 0.7, bx: -3, by: -14, be: 1 }),
    ],
    [t.parry + frame(8), s({ ...HOLD, hy: -11, ny: -20.5, fx: 7, fy: -15, sa: 1.6 })],
    [t.parryEnd, s(HOLD)],
  ],
};
