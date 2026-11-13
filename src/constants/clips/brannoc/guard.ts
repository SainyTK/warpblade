import type { ActionClip, Pose } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { s } from "./stance";

/**
 * His guard: sunk low, the great axe held flat across his chest in both hands, the near hand forward and the head back
 * over his far shoulder, so a blow lands on the haft
 */
const HOLD: Partial<Pose> = {
  hx: -1,
  hy: -12.6,
  cb: 0.6,
  nx: 1.4,
  ny: -22.4,
  fx: 7.4,
  fy: -19.6,
  sa: -2.85,
  ffx: 5.6,
  bfx: -5.6,
  ba: 0.3,
};
const t = GUARD_TIMES;

/**
 * Brannoc's guard in the shared segments: the haft swung up across his chest; the held guard breathing; the jolt of a
 * block that drives the haft into his chest and him back onto the rear foot; and the parry, the haft driven up and out
 * into the blow before he settles behind it again.
 */
export const BRANNOC_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, s({ hy: -13.2, fx: 5.6, fy: -18, sa: -2.2 })],
    [t.loopFrom, s(HOLD), "snap"],
    [frame(16), s({ ...HOLD, hy: -12.2, ny: -22, fy: -19.2 })],
    [frame(32), s({ ...HOLD, hy: -12.8, ny: -22.6, fy: -19.8, sa: -2.8 })],
    [t.loopTo - 0.001, s(HOLD)],
    [
      t.block,
      s({ ...HOLD, hx: -2.6, cb: -0.4, nx: -0.6, ny: -21.8, fx: 4.8, fy: -19, sa: -2.95, bfx: -7, ba: 0.6 }),
      "snap",
    ],
    [t.block + frame(3), s({ ...HOLD, hx: -2, nx: 0.2, fx: 5.8, sa: -2.9, bfx: -6.6, ba: 0.5 })],
    [t.blockEnd - 0.001, s(HOLD)],
    [t.parry, s({ ...HOLD, hy: -13.4, cb: 1, nx: 3.2, ny: -23.4, fx: 10, fy: -23.4, sa: -2.5, ffx: 6.6 }), "snap"],
    [t.parry + frame(3), s({ ...HOLD, hy: -13.6, cb: 1, nx: 3, ny: -23.6, fx: 9.4, fy: -24.6, sa: -2.4, ffx: 6.6 })],
    [t.parry + frame(8), s({ ...HOLD, hy: -13, nx: 2, ny: -23, fx: 8.2, fy: -21, sa: -2.7 })],
    [t.parryEnd, s(HOLD)],
  ],
};
