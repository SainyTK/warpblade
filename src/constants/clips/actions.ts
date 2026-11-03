import type { ActionClip } from "../../types/pose";
import { POSES, pose, READY } from "../hero";

/** casting a spell, throwing the sword and the strike on arriving from a warp */
export const ACTION_CLIPS = {
  cast: {
    dur: 0.48,
    hit: 0.25,
    keys: [
      [0, pose({ bx: 6, by: -21, fx: -2, fy: -15, sa: 2.4, hy: -13, ny: -23 })],
      [0.22, pose({ bx: 9, by: -23, fx: -3, fy: -15, sa: 2.5, hy: -12, ny: -22, nx: 0 })],
      [
        0.25,
        pose({ bx: 14, by: -22, fx: -3, fy: -16, sa: 2.5, hy: -13, nx: 4, ny: -23, hx: 1, ffx: 6, bfx: -5 }),
        "snap",
      ],
      [0.33, pose({ bx: 11, by: -22, fx: -3, fy: -16, sa: 2.5, hy: -13, nx: 3, ny: -23, hx: 1, ffx: 6, bfx: -5 })],
      [0.48, READY],
    ],
  },
  throw: {
    dur: 0.15,
    hit: 0.1,
    keys: [
      [0, READY],
      [0.06, pose({ fx: -6, fy: -27, sa: -2.6, nx: -1, hx: -1, bx: 5, by: -20, hy: -13 })],
      [0.1, POSES.throwHold, "snap"],
      [0.15, POSES.throwHold],
    ],
  },
  warpStrike: {
    dur: 0.4,
    hit: 0,
    keys: [
      [
        0,
        pose({
          hx: 3,
          hy: -13,
          nx: 7,
          ny: -22,
          fx: 16,
          fy: -20,
          sa: -0.05,
          bx: -6,
          by: -21,
          ffx: 9,
          ffy: -1,
          bfx: -6,
          bfy: -1,
        }),
      ],
      [0.1, pose({ hx: 3, hy: -12, nx: 6, ny: -21, fx: 14, fy: -12, sa: 0.9, bx: -6, by: -20, ffx: 9, bfx: -6 })],
      [0.4, READY],
    ],
  },
} satisfies Record<string, ActionClip>;
