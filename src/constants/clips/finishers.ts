import type { ActionClip, Pose } from "../../types/pose";
import { frame, POSES, pose, READY } from "../hero";

/** curled up mid back flip, leaning back */
const FLIP_BALL: Pose = pose({
  hy: -18,
  nx: -3,
  ny: -24,
  fx: -4,
  fy: -16,
  sa: 2.4,
  bx: -2,
  by: -17,
  ffx: 3,
  ffy: -12,
  bfx: -2,
  bfy: -10,
});

/** finishers and the dash strike */
export const FINISHER_CLIPS = {
  /** a cut rising into a back flip: curled up, over with his back to the camera, then open for the landing */
  flip: {
    dur: 0.42,
    hit: 0.05,
    keys: [
      [0, pose({ hx: 1, nx: 4, ny: -23, fx: 11, fy: -17, sa: 0.3, bx: -5, by: -19, ffx: 7, bfx: -6 })],
      [
        frame(1),
        pose({
          hx: 1,
          hy: -15,
          nx: 0,
          ny: -25,
          fx: 9,
          fy: -31,
          sa: -1.0,
          bx: -6,
          by: -22,
          ffx: 6,
          ffy: -5,
          bfx: -3,
          bfy: -2,
        }),
        "snap",
      ],
      [frame(4), FLIP_BALL, "snap"],
      [frame(7), { ...FLIP_BALL, tw: 1 }, "snap"],
      [frame(9), POSES.fall, "snap"],
      [0.42, POSES.fall],
    ],
  },
  /** flat and low with the blade trailing as he runs through the foe, then, turned on the far side, the cut shown wide */
  phase: {
    dur: 0.32,
    hit: 0.09,
    keys: [
      [0, pose({ hx: 2, hy: -8, nx: 12, ny: -12, fx: -6, fy: -10, sa: 2.95, bx: -4, by: -12, ffx: 10, bfx: -12 })],
      [
        frame(2),
        pose({ hx: 2, hy: -10, nx: 7, ny: -19, fx: 15, fy: -17, sa: -0.3, bx: -6, by: -15, ffx: 11, bfx: -8 }),
        "snap",
      ],
      [
        frame(5),
        pose({ hx: 2, hy: -10, nx: 7, ny: -19, fx: 14, fy: -19, sa: -0.6, bx: -6, by: -15, ffx: 11, bfx: -8 }),
      ],
      [0.32, READY],
    ],
  },
  /** folded into the deepest crouch, then a straight jump with the body stretched long and the blade at the sky */
  skyRend: {
    dur: 0.44,
    hit: 0.1,
    keys: [
      [0, pose({ hy: -6, nx: 3, ny: -15, fx: 6, fy: -4, sa: 1.8, bx: 4, by: -5, ffx: 7, bfx: -7 })],
      [frame(1), pose({ hy: -5.5, nx: 3, ny: -14.5, fx: 6, fy: -3, sa: 1.9, bx: 4, by: -4, ffx: 7, bfx: -7 })],
      [
        frame(2),
        pose({ hy: -18, nx: 0, ny: -28, fx: 2, fy: -40, sa: -1.57, bx: 1, by: -38, ffx: 1, ffy: 0, bfx: -1, bfy: 1 }),
        "snap",
      ],
      [
        frame(7),
        pose({ hy: -18, nx: 0, ny: -28, fx: 2, fy: -40, sa: -1.57, bx: 1, by: -38, ffx: 1, ffy: 0, bfx: -1, bfy: 1 }),
      ],
      [0.44, POSES.fall],
    ],
  },
  /** flat out of the dash: a low cut on the slide, then up tall with the blade swept to the sky */
  dashCut: {
    dur: 0.34,
    hit: 0.05,
    keys: [
      [0, pose({ hx: 2, hy: -9, nx: 10, ny: -15, fx: 4, fy: -22, sa: -2.2, bx: -3, by: -12, ffx: 12, bfx: -10 })],
      [
        frame(1),
        pose({ hx: 2, hy: -9, nx: 10, ny: -15, fx: 19, fy: -8, sa: 0.9, bx: -3, by: -12, ffx: 12, bfx: -10 }),
        "snap",
      ],
      [frame(2), pose({ hx: 2, hy: -9, nx: 10, ny: -15, fx: 14, fy: -6, sa: 1.5, bx: -3, by: -12, ffx: 12, bfx: -10 })],
      [
        frame(3),
        pose({ hx: 1, hy: -16, nx: 0, ny: -26, fx: 6, fy: -36, sa: -1.4, bx: -5, by: -22, ffx: 4, ffy: -4, bfx: -3 }),
        "snap",
      ],
      [
        frame(6),
        pose({ hx: 1, hy: -16, nx: 0, ny: -26, fx: 5, fy: -36, sa: -1.6, bx: -5, by: -22, ffx: 4, ffy: -3, bfx: -3 }),
      ],
      [0.34, READY],
    ],
  },
} satisfies Record<string, ActionClip>;
