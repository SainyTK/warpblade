import type { ActionClip } from "../../types/pose";
import { frame, pose, READY } from "../hero";

/**
 * The plain ground string. Each hit has its own body: weight thrown back then a long step, a crouch that rises onto one
 * leg, a lunge with the body flat, a tucked hop that folds into a kneeling cleave, a spin that shows Kael's back, and a
 * wind-up with his back turned that unwinds into a wide, deep smash.
 */
export const GROUND_CLIPS = {
  /** weight back with the blade over the shoulder, then a long step, chest up, into a falling cut */
  atk1: {
    dur: 0.34,
    hit: 0.09,
    keys: [
      [
        0,
        pose({
          hx: -2,
          hy: -14,
          nx: -4,
          ny: -23.5,
          fx: -4,
          fy: -29,
          sa: -2.4,
          bx: 4,
          by: -20,
          ffx: 3,
          ffy: -2,
          bfx: -5,
        }),
      ],
      [
        frame(1),
        pose({ hx: -2, hy: -14, nx: -5, ny: -23, fx: -6, fy: -30, sa: -2.6, bx: 4, by: -21, ffx: 3, ffy: -2, bfx: -5 }),
      ],
      [
        frame(2),
        pose({ hx: 4, hy: -12, nx: 6, ny: -22, fx: 17, fy: -18, sa: 0.4, bx: -6, by: -18, ffx: 12, bfx: -7 }),
        "snap",
      ],
      [frame(5), pose({ hx: 4, hy: -12, nx: 6, ny: -22, fx: 16, fy: -14, sa: 0.9, bx: -6, by: -18, ffx: 12, bfx: -7 })],
      [0.34, READY],
    ],
  },
  /** a deep crouch with the blade low behind, then up onto one leg with the blade swept over the head */
  atk2: {
    dur: 0.34,
    hit: 0.09,
    keys: [
      [0, pose({ hx: -1, hy: -9, nx: 3, ny: -18, fx: -6, fy: -7, sa: 2.7, bx: 4, by: -13, ffx: 6, bfx: -7 })],
      [frame(1), pose({ hx: -1, hy: -8, nx: 4, ny: -17, fx: -7, fy: -6, sa: 2.8, bx: 5, by: -12, ffx: 6, bfx: -7 })],
      [
        frame(2),
        pose({ hx: 1, hy: -16, nx: -1, ny: -26, fx: 3, fy: -35, sa: -1.9, bx: 8, by: -21, ffx: 6, ffy: -7, bfx: -1 }),
        "snap",
      ],
      [
        frame(5),
        pose({ hx: 1, hy: -16, nx: -1, ny: -26, fx: 0, fy: -34, sa: -2.3, bx: 8, by: -21, ffx: 6, ffy: -6, bfx: -1 }),
      ],
      [0.34, READY],
    ],
  },
  /** two stabs from a lunge so deep the body lies almost flat: drawn back, out, half back, out lower */
  twinFang: {
    dur: 0.34,
    hit: 0.07,
    keys: [
      [0, pose({ hx: -2, hy: -12, nx: -3, ny: -22, fx: -6, fy: -17, sa: 0, bx: 3, by: -19, ffx: 5, bfx: -5 })],
      [
        frame(2),
        pose({ hx: 3, hy: -8, nx: 12, ny: -13, fx: 24, fy: -13, sa: 0, bx: 3, by: -14, ffx: 14, bfx: -10 }),
        "snap",
      ],
      [frame(3), pose({ hx: 2, hy: -9, nx: 9, ny: -15, fx: 13, fy: -14, sa: 0.05, bx: 2, by: -15, ffx: 14, bfx: -10 })],
      [
        frame(4),
        pose({ hx: 4, hy: -8, nx: 13, ny: -13, fx: 25, fy: -11, sa: 0.1, bx: 3, by: -11, ffx: 16, bfx: -9 }),
        "snap",
      ],
      [
        frame(7),
        pose({ hx: 4, hy: -8, nx: 13, ny: -13.5, fx: 24, fy: -11, sa: 0.15, bx: 3, by: -11, ffx: 16, bfx: -9 }),
      ],
      [0.34, READY],
    ],
  },
  /** a crouch, a hop with the knees tucked and the body arched back under the raised blade, then folded over into a
   *  cleave that lands him on one knee */
  hopCleave: {
    dur: 0.46,
    hit: 0.2,
    keys: [
      [0, pose({ hy: -9, nx: 2, ny: -18, fx: -4, fy: -20, sa: -2.4, bx: 2, by: -17, ffx: 4, bfx: -5 })],
      [
        frame(2),
        pose({
          hy: -17,
          nx: -2,
          ny: -27,
          fx: -6,
          fy: -34,
          sa: -2.6,
          bx: -3,
          by: -33,
          ffx: 5,
          ffy: -9,
          bfx: -3,
          bfy: -7,
        }),
      ],
      [
        frame(5),
        pose({
          hy: -17,
          nx: -3,
          ny: -27,
          fx: -8,
          fy: -32,
          sa: -2.9,
          bx: -4,
          by: -32,
          ffx: 5,
          ffy: -9,
          bfx: -3,
          bfy: -7,
        }),
      ],
      [
        frame(6),
        pose({
          hx: 2,
          hy: -12,
          nx: 10,
          ny: -19,
          fx: 17,
          fy: -8,
          sa: 1.3,
          bx: 14,
          by: -9,
          ffx: 10,
          ffy: -1,
          bfx: -6,
          bfy: -3,
        }),
        "snap",
      ],
      [frame(9), pose({ hx: 1, hy: -7, nx: 8, ny: -15, fx: 17, fy: -4, sa: 1.5, bx: 14, by: -5, ffx: 8, bfx: -8 })],
      [0.46, READY],
    ],
  },
  /** a wide flat cut in front, a turn that shows his back with the blade overhead, and the same cut behind him */
  crescent: {
    dur: 0.4,
    hit: 0.07,
    keys: [
      [0, pose({ hy: -13, nx: -1, ny: -23, fx: -4, fy: -10, sa: 2.5, bx: 4, by: -18, ffx: 5, bfx: -4 })],
      [
        frame(2),
        pose({ hx: 2, hy: -12, nx: 6, ny: -21, fx: 15, fy: -18, sa: -0.1, bx: -6, by: -17, ffx: 9, bfx: -6 }),
        "snap",
      ],
      [
        frame(3),
        pose({ hx: 1, hy: -13, nx: 0, ny: -23, fx: -2, fy: -25, sa: -1.8, bx: 4, by: -20, ffx: -3, bfx: 4, tw: 1 }),
        "snap",
      ],
      [
        frame(5),
        pose({ hx: 2, hy: -12, nx: 7, ny: -20, fx: 15, fy: -17, sa: 0.1, bx: -5, by: -17, ffx: 9, bfx: -7, mr: 1 }),
        "snap",
      ],
      [
        frame(8),
        pose({ hx: 2, hy: -12, nx: 7, ny: -20, fx: 14, fy: -14, sa: 0.5, bx: -5, by: -17, ffx: 9, bfx: -7, mr: 1 }),
      ],
      [
        frame(9),
        pose({ hx: 0, hy: -13, nx: 0, ny: -23, fx: 3, fy: -18, sa: 1.2, bx: -3, by: -18, ffx: 3, bfx: -3, tw: 1 }),
        "snap",
      ],
      [frame(10), READY, "snap"],
      [0.4, READY],
    ],
  },
  /** the blade wound up overhead with his back to the foe, up on the toes, then unwound into a smash from a stance so
   *  wide and low his hips nearly touch the floor */
  atk3: {
    dur: 0.5,
    hit: 0.16,
    keys: [
      [
        0,
        pose({ hx: -1, hy: -14, nx: -3, ny: -24, fx: -6, fy: -33, sa: -2.4, bx: -2, by: -30, ffx: 3, bfx: -4, tw: 1 }),
      ],
      [
        frame(3),
        pose({
          hx: -2,
          hy: -16,
          nx: -4,
          ny: -26,
          fx: -8,
          fy: -34,
          sa: -2.7,
          bx: -4,
          by: -32,
          ffx: 3,
          ffy: -1,
          bfx: -4,
          bfy: -2,
          tw: 1,
        }),
      ],
      [
        frame(4),
        pose({ hx: 4, hy: -7, nx: 11, ny: -15, fx: 20, fy: -5, sa: 1.2, bx: 16, by: -6, ffx: 15, bfx: -10 }),
        "snap",
      ],
      [frame(9), pose({ hx: 4, hy: -6, nx: 11, ny: -14, fx: 20, fy: -3, sa: 1.4, bx: 16, by: -4, ffx: 15, bfx: -10 })],
      [0.5, READY],
    ],
  },
} satisfies Record<string, ActionClip>;
