import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { y, yFree } from "./stanceBase";

/** the ultimate gathering: coiled low, the glaive swept back and down behind her, the far hand open toward the foe */
const COIL = {
  hx: -1.5,
  hy: -10.5,
  cb: 1,
  nx: 1.5,
  ny: -20.5,
  fx: -1,
  fy: -12,
  sa: 2.75,
  bx: 8,
  by: -18,
  ffx: 7,
  bfx: -7,
  ba: 0.5,
} as const;

/** Ysra gathering her ultimate and letting it loose. */
export const STANCE_HELD_CLIPS = {
  /** the coil held, breathing the fire in: the shoulders rise and the point drags a little further back on each breath */
  charge: {
    dur: frame(36),
    hit: 0,
    keys: [
      [0, yFree(COIL)],
      [frame(4), yFree({ ...COIL, ny: -21, cb: 1.5, by: -18.5, sa: 2.8 })],
      [frame(9), yFree({ ...COIL, hy: -11, ny: -21.5, cb: 1.5, fy: -12.5, by: -19, sa: 2.85 })],
      [frame(13), yFree({ ...COIL, hy: -11, ny: -21.5, cb: 1.5, fy: -12.5, by: -19, sa: 2.85 })],
      [frame(18), yFree({ ...COIL, by: -18, sa: 2.78 })],
      [frame(22), yFree({ ...COIL, hy: -10, ny: -20, cb: 0.5, fy: -11.5, by: -17.5, sa: 2.72 })],
      [frame(27), yFree({ ...COIL, hy: -10, ny: -20, cb: 0.5, fy: -11.5, by: -17.5, sa: 2.7 })],
      [frame(32), yFree({ ...COIL, ny: -20.5, by: -18, sa: 2.73 })],
    ],
  },
  /** let loose: the glaive whipped up and over her head in a full arc, then driven point first into the floor ahead as she drops to a knee */
  ultimate: {
    dur: 0.7,
    hit: frame(6),
    keys: [
      [0, yFree(COIL)],
      [frame(2), y({ hy: -14, cb: -1, nx: 0, ny: -24, fx: 1, fy: -22, sa: -2.4, ffx: 7, bfx: -7, ba: 0.3 }, 6), "snap"],
      [frame(4), y({ hy: -15, cb: -1, nx: 1, ny: -25, fx: 4, fy: -30, sa: -1.3, ffx: 7, bfx: -7, ba: 0.3 }, 7)],
      [
        frame(6),
        y(
          {
            hx: 1,
            hy: -7.5,
            cb: 2,
            nx: 5,
            ny: -16.5,
            fx: 11,
            fy: -10,
            sa: 1.0,
            ffx: 8,
            ffy: 0,
            bfx: -5,
            bfy: 0,
            ba: 1.2,
          },
          7,
        ),
        "snap",
      ],
      [frame(7), y({ hx: 1, hy: -7, cb: 2, nx: 5, ny: -16, fx: 11, fy: -9.5, sa: 1.0, ffx: 8, bfx: -5, ba: 1.2 }, 7)],
      [
        frame(13),
        y({ hx: 1, hy: -7.5, cb: 2, nx: 5, ny: -16.5, fx: 11, fy: -10, sa: 1.0, ffx: 8, bfx: -5, ba: 1.2 }, 7),
      ],
      [frame(16), y({ hy: -10, cb: 1, nx: 3.5, ny: -19.5, fx: 9, fy: -13, sa: 0.6, ffx: 7, bfx: -6, ba: 0.5 }, 7)],
      [frame(19), y({ hy: -12, nx: 2, ny: -22, fx: 7, fy: -15, sa: -0.4, ffx: 5.5, bfx: -5.5, ba: 0.2 }, 6)],
      [0.7, y({})],
    ],
  },
} satisfies Record<string, ActionClip>;
