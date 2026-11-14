import { GUARD_TIMES as t } from "../../../../constants/combat";
import { frame } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { grip } from "./grip";

/** the guard: sunk on wide feet, Anvilheart held upright before her body in both hands so blows meet its flat */
const HOLD = {
  hx: -1,
  hy: -12,
  cb: -0.4,
  nx: 0.5,
  ny: -22,
  fx: 6.5,
  fy: -15.5,
  sa: -1.5,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;

/**
 * Brynn's guard in the shared segments: the blade swung up before her; the held guard breathing; the jolt of a block,
 * shoved back onto the rear foot with the flat pressed to her shoulder; and the parry, the Counter Cleave: the blade
 * flung over and down across the front in one wide cut and dragged round behind.
 */
export const BRYNN_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, grip({ hy: -13, nx: 1, ny: -23, fx: 6, fy: -19, sa: -1.1, ffx: 5, bfx: -5 })],
    [t.loopFrom, grip(HOLD), "snap"],
    [frame(8), grip({ ...HOLD, ny: -21.6, cb: -0.2, fy: -15.2 })],
    [frame(15), grip({ ...HOLD, hy: -11.7, ny: -21.8, sa: -1.47 })],
    [t.loopTo - 0.001, grip(HOLD)],
    [
      t.block,
      grip({ ...HOLD, hx: -2.5, cb: -1, nx: -1.5, ny: -21.5, fx: 4, fy: -16, sa: -1.62, bfx: -7.5, ba: 0.6 }),
      "snap",
    ],
    [t.block + frame(3), grip({ ...HOLD, hx: -2, nx: -0.6, fx: 5, sa: -1.56, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, grip(HOLD)],
    [
      t.parry,
      grip({ hx: 2.5, hy: -11, cb: 1.2, nx: 6, ny: -20.5, fx: 14, fy: -12, sa: 0.35, ffx: 10, bfx: -7, ba: 0.7 }),
      "snap",
    ],
    [
      t.parry + frame(2),
      grip({ hx: 2.8, hy: -10.8, cb: 1.3, nx: 6.3, ny: -20.3, fx: 13, fy: -10.5, sa: 0.75, ffx: 10, bfx: -7, ba: 0.7 }),
    ],
    [
      t.parry + frame(5),
      grip({ hx: 1.5, hy: -11.5, cb: 0.6, nx: 3.5, ny: -21.5, fx: 9, fy: -14, sa: -0.4, ffx: 8.5, bfx: -6.5 }),
    ],
    [t.parryEnd, grip(HOLD)],
  ],
};
