import type { ActionClip } from "../../../types/pose";
import type { LampBlow } from "../../../types/wenna";
import { frame } from "../../hero";
import { LAMP_BLOWS } from "../../wenna/lamp";
import { HANG_LEGS, m, STANCE } from "./stance";

/**
 * Her lamp string. Each blow draws the pole back the other way first, snaps to a new silhouette on its hit frame,
 * follows through and settles back to the stance, so the next blow starts where this one left her. The lantern on its
 * chain is a pendulum drawn by her kit, so it lags each snap and swings on past the pole after the pole stops.
 */
export const LAMP_CLIPS: Record<LampBlow, ActionClip> = {
  /** two calm frames drawing the pole back level at the hip, a snap to full extension, three frames of follow-through */
  tap: {
    dur: LAMP_BLOWS.tap.dur,
    hit: LAMP_BLOWS.tap.hit,
    keys: [
      [0, STANCE],
      [
        frame(2),
        m({ nx: 0.5, hx: -0.5, cb: -0.4, fx: 1, fy: -14, sa: 0.05, bx: -3.5, by: -14, be: 0, ffx: 4, bfx: -3 }),
      ],
      [frame(3), m({ nx: 0, hx: -1, cb: -0.6, fx: -0.5, fy: -14, sa: 0.06, bx: -5, by: -14, be: 0, ffx: 4, bfx: -3 })],
      [
        frame(4),
        m({
          nx: 3,
          hx: 1,
          cb: 1,
          ny: -23.5,
          fx: 4.5,
          fy: -14.5,
          sa: 0,
          bx: 0,
          by: -14.5,
          be: 0,
          ffx: 6,
          bfx: -4,
          ba: 0.3,
        }),
        "snap",
      ],
      [
        frame(5),
        m({
          nx: 2.8,
          hx: 1,
          cb: 0.9,
          ny: -23.5,
          fx: 4.2,
          fy: -14.4,
          sa: 0.02,
          bx: -0.3,
          by: -14.4,
          be: 0,
          ffx: 6,
          bfx: -4,
        }),
      ],
      [
        frame(7),
        m({
          nx: 2.2,
          hx: 0.6,
          cb: 0.6,
          ny: -23.7,
          fx: 4,
          fy: -14.8,
          sa: -0.12,
          bx: 0,
          by: -14.4,
          be: 0,
          ffx: 5,
          bfx: -3.5,
        }),
      ],
      [frame(9), STANCE],
    ],
  },
  /**
   * A crouch with the pole swung up over her shoulder and low behind her, one sweep from low ahead up to level (her kit
   * draws the arc's smear), the pole stopping while the lantern swings on
   */
  swing: {
    dur: LAMP_BLOWS.swing.dur,
    hit: LAMP_BLOWS.swing.hit,
    keys: [
      [0, STANCE],
      [
        frame(2),
        m({
          hy: -12.8,
          ny: -22.8,
          nx: -0.5,
          cb: -0.4,
          fx: 1,
          fy: -16,
          sa: -2.6,
          bx: -1,
          by: -14,
          be: 1,
          ffx: 4,
          bfx: -3,
        }),
      ],
      [
        frame(4),
        m({ hy: -11.6, ny: -21.6, nx: -1, cb: -0.6, fx: -1, fy: -12.5, sa: -3.42, bx: -4, by: -12.5, ffx: 5, bfx: -4 }),
      ],
      [
        frame(5),
        m({
          hy: -12.4,
          ny: -22.4,
          nx: 3,
          cb: 1,
          fx: 7,
          fy: -14,
          sa: 0.38,
          bx: 3,
          by: -14,
          be: 0,
          ffx: 6,
          bfx: -4,
          ba: 0.3,
        }),
        "snap",
      ],
      [
        frame(7),
        m({
          hy: -13.2,
          ny: -23.2,
          nx: 2.8,
          cb: 0.9,
          fx: 8,
          fy: -15.5,
          sa: -0.05,
          bx: 3.5,
          by: -15,
          be: 0,
          ffx: 6,
          bfx: -4,
        }),
      ],
      [
        frame(9),
        m({ hy: -13.6, ny: -23.6, nx: 2, cb: 0.4, fx: 7, fy: -16, sa: -0.4, bx: 4, by: -14.5, ffx: 5, bfx: -3.5 }),
      ],
      [frame(11), STANCE],
    ],
  },
  /**
   * Four calm frames lowering the lantern to chest height in both hands, the shutter thrown open on the hit frame with
   * the lantern pushed out, a short hold, then four frames as the shutter closes and she draws it back
   */
  flare: {
    dur: LAMP_BLOWS.flare.dur,
    hit: LAMP_BLOWS.flare.hit,
    keys: [
      [0, STANCE],
      [frame(2), m({ nx: 0.8, cb: 0, fx: 5, fy: -19, sa: -0.95, bx: 2.7, by: -15.7, be: 0, ffx: 3.5, bfx: -3 })],
      [frame(4), m({ nx: 0.5, cb: 0.3, fx: 3, fy: -18, sa: -0.5, bx: -1.4, by: -15.6, be: 0, ffx: 4, bfx: -3 })],
      [frame(6), m({ nx: 0.2, cb: 0, fx: 2.6, fy: -18.2, sa: -0.48, bx: -1.8, by: -15.8, be: 0, ffx: 4, bfx: -3 })],
      [
        frame(7),
        m({ nx: 2.5, cb: 0.8, fx: 6, fy: -18.5, sa: -0.42, bx: 1.5, by: -16, be: 0, ffx: 5.5, bfx: -4, ba: 0.3 }),
        "snap",
      ],
      [frame(9), m({ nx: 2.3, cb: 0.7, fx: 5.8, fy: -18.4, sa: -0.43, bx: 1.3, by: -16, be: 0, ffx: 5.5, bfx: -4 })],
      [frame(11), m({ nx: 1.8, cb: 0.4, fx: 5, fy: -18, sa: -0.55, bx: 1, by: -15.5, be: 0, ffx: 5, bfx: -3.5 })],
      [frame(13), m({ nx: 1.3, cb: 0, fx: 5.5, fy: -17.5, sa: -0.95, bx: 3, by: -14, ffx: 4, bfx: -3 })],
      [frame(15), STANCE],
    ],
  },
  /** in the air: the pole raised up and back, then swung down ahead in one arc, legs together */
  drop: {
    dur: LAMP_BLOWS.drop.dur,
    hit: LAMP_BLOWS.drop.hit,
    keys: [
      [0, m({ ...HANG_LEGS, fx: 6, fy: -20, sa: -1.2, bx: 4, by: -17 })],
      [frame(2), m({ ...HANG_LEGS, nx: -0.5, cb: -0.6, fx: 2, fy: -27, sa: -2, bx: 0, by: -24, be: 1 })],
      [frame(3), m({ ...HANG_LEGS, nx: -1, cb: -0.8, fx: 1, fy: -28, sa: -2.2, bx: -1, by: -25, be: 1 })],
      [frame(4), m({ ...HANG_LEGS, nx: 3, cb: 1.2, fx: 9, fy: -16, sa: 0.85, bx: 6, by: -16, be: 0 }), "snap"],
      [frame(6), m({ ...HANG_LEGS, nx: 2.5, cb: 1, fx: 8.5, fy: -15, sa: 1.05, bx: 5.5, by: -15 })],
      [frame(8), m({ ...HANG_LEGS, nx: 1.5, cb: 0.4, fx: 7, fy: -17, sa: 0.3, bx: 4.5, by: -16 })],
      [frame(10), m({ ...HANG_LEGS, fx: 6, fy: -19, sa: -0.6, bx: 4, by: -17 })],
    ],
  },
};
