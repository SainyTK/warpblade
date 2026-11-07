import type { ChainBlow } from "../../../types/orrin";
import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { CHAIN_BLOWS, HANGING_ARC } from "../../orrin/string";
import { o, STANCE, TUCK } from "./stance";

/**
 * His chain string. Each blow draws the chain hand back the other way first, snaps out on its hit frame and falls back
 * to the stance, so the next blow starts where this one left him.
 */
export const CHAIN_CLIPS: Record<ChainBlow, ActionClip> = {
  /** the arm draws back for three frames with the chain trailing, then snaps straight out level */
  lash: {
    dur: CHAIN_BLOWS.lash.dur,
    hit: CHAIN_BLOWS.lash.hit,
    keys: [
      [0, STANCE],
      [frame(2), o({ nx: 0, hx: -0.5, fx: 1, fy: -20, fe: 1, sa: -2.4, bx: 5, by: -18 })],
      [frame(4), o({ nx: -0.5, hx: -1, cb: -0.5, fx: -2, fy: -21, fe: 1, sa: -2.8, bx: 6, by: -18, ffx: 5, bfx: -5 })],
      [
        frame(5),
        o({
          nx: 4,
          hx: 1,
          cb: 1,
          ny: -23,
          fx: 13,
          fy: -19,
          fe: 0,
          sa: 0,
          bx: -2,
          by: -17,
          be: 0,
          ffx: 6,
          bfx: -5,
          ba: 0.3,
        }),
        "snap",
      ],
      [frame(7), o({ nx: 3.5, hx: 1, cb: 1, ny: -23, fx: 12, fy: -18, sa: 0.3, bx: -1, by: -17, ffx: 6, bfx: -5 })],
      [frame(10), STANCE],
    ],
  },
  /** close in: a knee driven up into the foe, the chain hand pulled back for balance */
  knee: {
    dur: CHAIN_BLOWS.knee.dur,
    hit: CHAIN_BLOWS.knee.hit,
    keys: [
      [0, STANCE],
      [frame(2), o({ hy: -12.5, nx: 0.5, ny: -22.5, fx: 2, fy: -16, ffx: 1, ffy: -1 })],
      [
        frame(4),
        o({
          hx: 1,
          hy: -14.5,
          nx: 1,
          ny: -24.5,
          cb: -0.5,
          fx: -2,
          fy: -17,
          bx: 6,
          by: -20,
          ffx: 7,
          ffy: -9,
          fa: 0.6,
          bfx: -2,
        }),
        "snap",
      ],
      [
        frame(6),
        o({ hx: 1, hy: -14, nx: 1, ny: -24, fx: -1, fy: -17, bx: 6, by: -20, ffx: 6, ffy: -6, fa: 0.4, bfx: -2 }),
      ],
      [frame(9), STANCE],
    ],
  },
  /** crouched with the chain low ahead, he sweeps it up and over, and it hangs behind his shoulder */
  rising: {
    dur: CHAIN_BLOWS.rising.dur,
    hit: CHAIN_BLOWS.rising.hit,
    keys: [
      [0, STANCE],
      [frame(2), o({ hy: -12, ny: -22, nx: 2, cb: 1, fx: 9, fy: -8, sa: 0.8, ffx: 5, bfx: -5 })],
      [frame(4), o({ hy: -11, ny: -21, nx: 2.5, cb: 1, fx: 10, fy: -6, sa: 0.7, bx: 4, by: -15, ffx: 6, bfx: -6 })],
      [
        frame(6),
        o({
          hy: -14.5,
          ny: -25,
          nx: 1,
          cb: -0.5,
          fx: 6,
          fy: -31,
          sa: -1.4,
          bx: -3,
          by: -17,
          be: 0,
          ffx: 4,
          bfx: -4,
          ba: 0.2,
        }),
        "snap",
      ],
      [
        frame(8),
        o({ hy: -14.5, ny: -25, nx: 0.5, cb: -1, fx: 1, fy: -32, sa: -2.2, bx: -3, by: -17, ffx: 4, bfx: -4 }),
      ],
      [frame(10), o({ hy: -14, ny: -24.5, nx: 0.5, cb: -0.5, fx: -1, fy: -25, sa: -2.6, bx: 1, by: -17 })],
      [frame(12), STANCE],
    ],
  },
  /** four calm frames with the chain swung overhead, a full turn of the body with the chain level, and a settle */
  circle: {
    dur: CHAIN_BLOWS.circle.dur,
    hit: CHAIN_BLOWS.circle.hit,
    keys: [
      [0, STANCE],
      [frame(2), o({ hy: -12.5, ny: -22.5, fx: 4, fy: -30, sa: -1.6, bx: 5, by: -17, ffx: 5, bfx: -5 })],
      [frame(4), o({ hy: -12, ny: -22, nx: 0.5, fx: -1, fy: -31, sa: -2.4, bx: 5, by: -17, ffx: 6, bfx: -6 })],
      [
        frame(6),
        o({ hy: -12, ny: -22, nx: 2, cb: 0.5, fx: 12, fy: -22, sa: 0, bx: -4, by: -18, ffx: 6, bfx: -6 }),
        "snap",
      ],
      [frame(8), o({ hy: -12, ny: -22, nx: 0, tw: 1, fx: 3, fy: -22, sa: 1.6, bx: 3, by: -18, ffx: 4, bfx: -6 })],
      [frame(10), o({ hy: -12, ny: -22, nx: -1, mr: 1, fx: 11, fy: -22, sa: 0, bx: -4, by: -18, ffx: 6, bfx: -6 })],
      [frame(12), o({ hy: -12, ny: -22, nx: 0, fx: 11, fy: -22, sa: 0, bx: -4, by: -18, ffx: 6, bfx: -6 })],
      [frame(15), o({ hy: -13, ny: -23, nx: 1, fx: 8, fy: -17, sa: 0.8, bx: 1, by: -18 })],
      [frame(18), STANCE],
    ],
  },
};

/** the Hanging Arc in the air: the chain hand thrown up and back, then brought down across in front of him */
export const HANGING_CLIP: ActionClip = {
  dur: HANGING_ARC.dur,
  hit: HANGING_ARC.hit,
  keys: [
    [0, o({ ...TUCK, fx: 4, fy: -28, sa: -1.6 })],
    [frame(3), o({ ...TUCK, nx: 0, cb: -0.5, fx: 0, fy: -32, sa: -2.4, bx: 6, by: -20 })],
    [frame(5), o({ ...TUCK, nx: 3, cb: 1, fx: 12, fy: -16, sa: 0.6, bx: -3, by: -20 }), "snap"],
    [frame(7), o({ ...TUCK, nx: 3, cb: 1, fx: 10, fy: -10, sa: 1.2, bx: -3, by: -20 })],
    [frame(11), o({ ...TUCK, fx: 7, fy: -15, sa: 1 })],
  ],
};
