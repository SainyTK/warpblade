import type { ActionClip } from "../../types/pose";
import { frame, POSES, pose, READY } from "../hero";

/** the moves the foes around Kael ask for: a foe behind, foes on both sides, a foe lying down, a foe in the air */
export const SITUATIONAL_CLIPS = {
  /** Kael has just turned: his back still to the foe and the blade trailing, then whipped round into a leaning cut */
  pivot: {
    dur: 0.34,
    hit: 0.08,
    keys: [
      [0, pose({ hx: -1, hy: -13, nx: -2, ny: -23, fx: -8, fy: -16, sa: 2.9, bx: 3, by: -18, ffx: -2, bfx: 3, tw: 1 })],
      [
        frame(1),
        pose({ hx: -1, hy: -12, nx: -3, ny: -22, fx: -9, fy: -15, sa: 3.0, bx: 3, by: -17, ffx: -2, bfx: 3, tw: 1 }),
      ],
      [
        frame(2),
        pose({ hx: 3, hy: -11, nx: 9, ny: -19, fx: 17, fy: -21, sa: -0.4, bx: -5, by: -15, ffx: 12, bfx: -8 }),
        "snap",
      ],
      [
        frame(5),
        pose({ hx: 3, hy: -11, nx: 9, ny: -19, fx: 15, fy: -24, sa: -0.9, bx: -5, by: -15, ffx: 12, bfx: -8 }),
      ],
      [0.34, READY],
    ],
  },
  /** down in a crouch with the legs spread, the blade swung flat along the floor in front, round behind his back, and
   *  out behind him */
  ring: {
    dur: 0.4,
    hit: 0.06,
    keys: [
      [0, pose({ hy: -8, nx: 1, ny: -17, fx: -6, fy: -8, sa: 2.9, bx: 4, by: -11, ffx: 8, bfx: -8 })],
      [
        frame(1),
        pose({ hx: 1, hy: -7, nx: 5, ny: -15.5, fx: 14, fy: -8, sa: 0.05, bx: -5, by: -10, ffx: 10, bfx: -9 }),
        "snap",
      ],
      [
        frame(3),
        pose({ hy: -8, nx: 0, ny: -17, fx: -4, fy: -14, sa: 2.7, bx: 3, by: -11, ffx: -6, bfx: 8, tw: 1 }),
        "snap",
      ],
      [
        frame(4),
        pose({ hx: 1, hy: -7, nx: 5, ny: -15.5, fx: 14, fy: -8, sa: 0.05, bx: -5, by: -10, ffx: 10, bfx: -9, mr: 1 }),
        "snap",
      ],
      [
        frame(7),
        pose({ hx: 1, hy: -7, nx: 5, ny: -15.5, fx: 13, fy: -7, sa: 0.2, bx: -5, by: -10, ffx: 10, bfx: -9, mr: 1 }),
      ],
      [
        frame(8),
        pose({ hy: -10, nx: 0, ny: -20, fx: 2, fy: -13, sa: 1.4, bx: -2, by: -13, ffx: 6, bfx: -6, tw: 1 }),
        "snap",
      ],
      [frame(9), READY, "snap"],
      [0.4, READY],
    ],
  },
  /** up on the toes with the blade raised point down in both hands, then dropped onto one knee to drive it into the
   *  foe on the floor */
  downStab: {
    dur: 0.4,
    hit: 0.13,
    keys: [
      [0, pose({ hy: -16, nx: 1, ny: -26, fx: 6, fy: -31, sa: 1.5, bx: 4, by: -30, ffx: 3, ffy: -2, bfx: -3 })],
      [
        frame(2),
        pose({ hx: 1, hy: -17, nx: 2, ny: -27, fx: 7, fy: -33, sa: 1.5, bx: 5, by: -32, ffx: 4, ffy: -3, bfx: -3 }),
      ],
      [
        frame(3),
        pose({ hx: 2, hy: -6, nx: 8, ny: -14, fx: 14, fy: -15, sa: 1.45, bx: 12, by: -14, ffx: 8, bfx: -7 }),
        "snap",
      ],
      [frame(8), pose({ hx: 2, hy: -6, nx: 8, ny: -14, fx: 14, fy: -14, sa: 1.5, bx: 12, by: -13, ffx: 8, bfx: -7 })],
      [0.4, READY],
    ],
  },
  /** a crouch, then a leap after the foe on a diagonal, knees tucked and the blade cutting up past it */
  chase: {
    dur: 0.36,
    hit: 0.08,
    keys: [
      [0, pose({ hy: -8, nx: 4, ny: -17, fx: -3, fy: -6, sa: 2.4, bx: 5, by: -12, ffx: 6, bfx: -7 })],
      [
        frame(2),
        pose({
          hy: -17,
          nx: 5,
          ny: -26,
          fx: 12,
          fy: -35,
          sa: -1.3,
          bx: -5,
          by: -22,
          ffx: 4,
          ffy: -10,
          bfx: -4,
          bfy: -6,
        }),
        "snap",
      ],
      [
        frame(6),
        pose({ hy: -17, nx: 4, ny: -26, fx: 8, fy: -37, sa: -1.9, bx: -5, by: -22, ffx: 4, ffy: -9, bfx: -4, bfy: -6 }),
      ],
      [0.36, POSES.jump],
    ],
  },
} satisfies Record<string, ActionClip>;
