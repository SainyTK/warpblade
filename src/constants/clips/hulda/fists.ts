import type { FistBlow } from "../../../types/hulda";
import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { FISTS, HAMMER } from "../../hulda/fists";
import { AIR_LEGS, GUARD, g } from "./stance";

/**
 * Her fist string. Each blow winds up the other way first, snaps to a new silhouette on its hit frame, holds while the
 * hit-stop runs and settles back to the guard, so the next one starts where this one ends.
 */
export const FIST_CLIPS: Record<FistBlow, ActionClip> = {
  /** the lead fist snaps straight out, the shoulder rolling in behind it */
  jab: {
    dur: FISTS.jab.dur,
    hit: FISTS.jab.hit,
    keys: [
      [0, GUARD],
      [frame(2), g({ nx: 1, fx: 6, fy: -19.5, hx: -1 })],
      [frame(3), g({ nx: 3, ny: -22.5, hx: 0, fx: 14, fy: -20, bx: 5, by: -21 }), "snap"],
      [frame(5), g({ nx: 2.5, fx: 13, fy: -20, bx: 5, by: -21 })],
      [frame(8), GUARD],
    ],
  },
  /** she dips, the lead fist drops back to the hip, then digs up into the body */
  hook: {
    dur: FISTS.hook.dur,
    hit: FISTS.hook.hit,
    keys: [
      [0, GUARD],
      [frame(2), g({ hy: -11.5, ny: -21.5, nx: 0.5, fx: 4, fy: -16, cb: 0 })],
      [frame(4), g({ hy: -11, ny: -21, nx: 0, fx: 2, fy: -14, cb: -0.5, ffx: 6, bfx: -6 })],
      [
        frame(5),
        g({ hy: -11, ny: -21, nx: 4, hx: 0.5, cb: 1, fx: 13, fy: -15, fe: 1, ffx: 6, bfx: -6, ba: 0.3 }),
        "snap",
      ],
      [frame(7), g({ hy: -11, ny: -21, nx: 3.5, hx: 0.5, cb: 1, fx: 12, fy: -15.5, fe: 1, ffx: 6, bfx: -6, ba: 0.3 })],
      [frame(9), g({ hy: -12, ny: -22, nx: 2.5, fx: 9, fy: -17.5 })],
      [frame(11), GUARD],
    ],
  },
  /** the arm cocks back past her head and she leans back, holds it, then the whole body throws it */
  haymaker: {
    dur: FISTS.haymaker.dur,
    hit: FISTS.haymaker.hit,
    keys: [
      [0, GUARD],
      [frame(2), g({ nx: 0, ny: -23, hx: -1, cb: -0.5, fx: 1, fy: -25, bx: 6, by: -20 })],
      [frame(4), g({ nx: -1, ny: -23, hx: -1.5, cb: -1, fx: -3, fy: -27, bx: 6, by: -19, ffx: 6, bfx: -5 })],
      [frame(6), g({ nx: -1.5, ny: -23, hx: -1.5, cb: -1, fx: -4, fy: -27.5, bx: 6, by: -19, ffx: 6, bfx: -5 })],
      [frame(7), g({ nx: -1.5, ny: -23, hx: -1.5, cb: -1, fx: -4, fy: -27.5, bx: 6.5, by: -19, ffx: 6, bfx: -5 })],
      [
        frame(8),
        g({
          hx: 1.5,
          hy: -12,
          nx: 6,
          ny: -21.5,
          cb: 1.5,
          fx: 16,
          fy: -19,
          bx: -2,
          by: -17,
          be: 0,
          ffx: 8,
          bfx: -6,
          ba: 0.5,
        }),
        "snap",
      ],
      [
        frame(10),
        g({
          hx: 1.5,
          hy: -12,
          nx: 5.5,
          ny: -21.5,
          cb: 1.5,
          fx: 15,
          fy: -18.5,
          bx: -2,
          by: -17,
          be: 0,
          ffx: 8,
          bfx: -6,
          ba: 0.5,
        }),
      ],
      [
        frame(12),
        g({ hx: 1.5, hy: -12, nx: 4.5, ny: -21.5, cb: 1, fx: 10, fy: -14, bx: 1, by: -18, ffx: 9, bfx: -4, ba: 0.3 }),
      ],
      [frame(14), g({ hx: 1, hy: -12.5, nx: 3, ny: -22, fx: 8, fy: -17, bx: 4, by: -19.5, ffx: 8, bfx: -3 })],
      [frame(16), g({ hx: 1, ffx: 7, bfx: -3 })],
    ],
  },
};

/** the hammer fist in the air: both fists overhead, then down */
export const HAMMER_CLIP: ActionClip = {
  dur: HAMMER.dur,
  hit: HAMMER.hit,
  keys: [
    [0, g({ hy: -14, ny: -24, ...AIR_LEGS })],
    [frame(2), g({ hy: -14, nx: 0, ny: -24, cb: -1, fx: 3, fy: -33, bx: 1, by: -33, be: 0, ...AIR_LEGS })],
    [frame(3), g({ hy: -14, nx: -0.5, ny: -24, cb: -1, fx: 2, fy: -34, bx: 0, by: -34, be: 0, ...AIR_LEGS })],
    [frame(4), g({ hy: -14, nx: 4, ny: -22, cb: 1.5, fx: 12, fy: -7, bx: 11, by: -8, be: 0, ...AIR_LEGS }), "snap"],
    [frame(6), g({ hy: -14, nx: 3.5, ny: -22, cb: 1.5, fx: 11, fy: -8, bx: 10, by: -9, be: 0, ...AIR_LEGS })],
    [frame(10), g({ hy: -14, ny: -24, ...AIR_LEGS })],
  ],
};
