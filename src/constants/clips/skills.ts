import type { ActionClip } from "../../types/pose";
import { frame, pose, READY } from "../hero";

/** ground moves a skill unlocks: the sweep, the launcher and the running thrust */
export const SKILL_CLIPS = {
  /** leaning back in a crouch, then a slide along the floor on one straight leg, the blade sweeping low ahead */
  sweep: {
    dur: 0.36,
    hit: 0.1,
    keys: [
      [0, pose({ hx: -1, hy: -9, nx: -3, ny: -18, fx: -7, fy: -12, sa: 2.8, bx: 3, by: -14, ffx: 4, bfx: -6 })],
      [frame(1), pose({ hx: -1, hy: -8, nx: -4, ny: -17, fx: -8, fy: -11, sa: 2.9, bx: 3, by: -13, ffx: 4, bfx: -6 })],
      [
        frame(2),
        pose({ hx: -1, hy: -5, nx: -4, ny: -14, fx: 12, fy: -4, sa: 0.1, bx: -9, by: -4, ffx: 13, ffy: -1, bfx: -4 }),
        "snap",
      ],
      [
        frame(6),
        pose({ hx: -1, hy: -5, nx: -4, ny: -14, fx: 11, fy: -4, sa: 0.3, bx: -9, by: -4, ffx: 13, ffy: -1, bfx: -4 }),
      ],
      [0.36, READY],
    ],
  },
  /** folded into a deep crouch, then stretched up onto the toes with both hands and the blade at the sky */
  uppercut: {
    dur: 0.4,
    hit: 0.1,
    keys: [
      [0, pose({ hy: -8, nx: 3, ny: -17, fx: 4, fy: -4, sa: 2.0, bx: 5, by: -6, ffx: 7, bfx: -7 })],
      [frame(1), pose({ hy: -7, nx: 3, ny: -16, fx: 4, fy: -3, sa: 2.1, bx: 5, by: -5, ffx: 7, bfx: -7 })],
      [
        frame(2),
        pose({ hy: -17, nx: -1, ny: -27, fx: 2, fy: -38, sa: -1.5, bx: 1, by: -36, ffx: 2, ffy: -1, bfx: -4, bfy: -4 }),
        "snap",
      ],
      [
        frame(6),
        pose({ hy: -17, nx: -1, ny: -27, fx: 1, fy: -38, sa: -1.7, bx: 0, by: -36, ffx: 2, ffy: -1, bfx: -4, bfy: -3 }),
      ],
      [0.4, READY],
    ],
  },
  /** drawn back off the run, then a lunge with the body flat and the blade straight out past the head */
  thrust: {
    dur: 0.36,
    hit: 0.12,
    keys: [
      [0, pose({ hx: -2, hy: -12, nx: -4, ny: -21, fx: -7, fy: -17, sa: 0, bx: 4, by: -20, ffx: 5, bfx: -6 })],
      [frame(2), pose({ hx: -2, hy: -11, nx: -5, ny: -20, fx: -8, fy: -16, sa: 0, bx: 4, by: -19, ffx: 5, bfx: -6 })],
      [
        frame(3),
        pose({ hx: 3, hy: -7, nx: 13, ny: -10, fx: 25, fy: -10, sa: -0.02, bx: 1, by: -9, ffx: 15, bfx: -11, bfy: -1 }),
        "snap",
      ],
      [frame(7), pose({ hx: 3, hy: -7, nx: 13, ny: -10.5, fx: 24, fy: -10, sa: 0, bx: 1, by: -9, ffx: 15, bfx: -11 })],
      [0.36, READY],
    ],
  },
} satisfies Record<string, ActionClip>;
