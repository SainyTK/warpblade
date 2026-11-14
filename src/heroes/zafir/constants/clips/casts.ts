import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { READY } from "./ready";

/**
 * His casts, each releasing on frame 4 (`SANDCAST.release`): Sandspout, a crouch with the far hand to the floor and the
 * blade sweeping up out of the sand; the crescent throw, the blade cocked behind and flung level; and a spell, the far
 * palm pushed out.
 */
export const CAST_CLIPS = {
  spout: {
    dur: frame(10),
    hit: frame(4),
    keys: [
      [0, READY],
      [
        frame(2),
        pose({
          hx: -0.5,
          hy: -11,
          cb: -1,
          nx: 1,
          ny: -20.5,
          fx: -2,
          fy: -12,
          sa: 2.6,
          bx: 5,
          by: -6,
          ffx: 6,
          bfx: -5,
          ba: 0.3,
        }),
      ],
      [
        frame(4),
        pose({ hx: 1, hy: -14.5, cb: 1, nx: 3, ny: -25, fx: 12, fy: -27, sa: -1.2, bx: 4, by: -24, ffx: 6, bfx: -5 }),
        "snap",
      ],
      [
        frame(6),
        pose({ hx: 1, hy: -14.5, cb: 1, nx: 3, ny: -25, fx: 11, fy: -26, sa: -1.1, bx: 3, by: -23, ffx: 6, bfx: -5 }),
      ],
      [frame(10), READY],
    ],
  },
  toss: {
    dur: frame(10),
    hit: frame(4),
    keys: [
      [0, READY],
      [
        frame(2),
        pose({ tw: 1, hx: -1, cb: -1, nx: -2, ny: -23, fx: -6, fy: -20, sa: 3.0, bx: 4, by: -17, ffx: 6, bfx: -5 }),
      ],
      [
        frame(4),
        pose({ hx: 2, hy: -13, cb: 1, nx: 4, ny: -23, fx: 14, fy: -20, sa: -0.1, bx: -6, by: -17, ffx: 8, bfx: -6 }),
        "snap",
      ],
      [
        frame(7),
        pose({ hx: 2, hy: -13, cb: 0.8, nx: 4, ny: -23, fx: 13, fy: -18, sa: 0.2, bx: -6, by: -16, ffx: 8, bfx: -6 }),
      ],
      [frame(10), READY],
    ],
  },
  push: {
    dur: frame(10),
    hit: frame(4),
    keys: [
      [0, READY],
      [frame(2), pose({ hx: -1, cb: -1, nx: -1, ny: -23, fx: 4, fy: -15, sa: 1.4, bx: -6, by: -19, ffx: 5, bfx: -5 })],
      [
        frame(4),
        pose({ hx: 1.5, cb: 1, nx: 4, ny: -23, fx: 4, fy: -14, sa: 1.2, bx: 13, by: -19, ffx: 7, bfx: -5 }),
        "snap",
      ],
      [
        frame(7),
        pose({ hx: 1.5, cb: 0.8, nx: 3.5, ny: -23, fx: 4, fy: -14, sa: 1.2, bx: 12, by: -18, ffx: 7, bfx: -5 }),
      ],
      [frame(10), READY],
    ],
  },
} satisfies Record<string, ActionClip>;
