import type { ActionClip, Pose } from "../../types/pose";
import { frame, POSES, pose } from "../hero";

/** knees drawn up under him, as in a jump */
const TUCK = { hy: -16, ffx: 4, ffy: -6, bfx: -3, bfy: -4 } as const;
/** curled into a ball, leaning back, the blade low behind */
const BALL: Pose = pose({
  hy: -18,
  nx: -3,
  ny: -24,
  fx: -6,
  fy: -12,
  sa: 2.6,
  bx: -1,
  by: -15,
  ffx: 3,
  ffy: -12,
  bfx: -2,
  bfy: -10,
});
/** the body flat in the air like a thrown spear, legs trailing straight out behind */
const FLAT = { hx: -2, hy: -14, nx: 8, ny: -19, bx: -2, by: -17, ffx: -16, ffy: -14, bfx: -17, bfy: -11 } as const;
/** the blade swung flat in front at chest height, for the whirlwind's turns */
const WHIRL_CUT: Pose = pose({ ...TUCK, nx: 2, ny: -26, fx: 13, fy: -19, sa: 0, bx: -6, by: -19 });
/** back to the camera mid-turn, the blade carried overhead */
const WHIRL_BACK: Pose = pose({ ...TUCK, nx: 0, ny: -26, fx: -2, fy: -23, sa: -1.6, bx: 3, by: -20, tw: 1 });

/** the air string, the whirlwind and the meteor drop */
export const AIR_CLIPS = {
  /** arched back with the blade high behind, then opened into a split with the body leaning into the cut */
  airCross: {
    dur: 0.3,
    hit: 0.08,
    keys: [
      [0, pose({ ...TUCK, hx: -1, nx: -4, ny: -25, fx: -6, fy: -30, sa: -2.4, bx: 3, by: -22 })],
      [
        frame(2),
        pose({
          hx: 1,
          hy: -16,
          nx: 8,
          ny: -24,
          fx: 16,
          fy: -14,
          sa: 0.6,
          bx: -6,
          by: -24,
          ffx: 9,
          ffy: -6,
          bfx: -10,
          bfy: -9,
        }),
        "snap",
      ],
      [
        frame(5),
        pose({
          hx: 1,
          hy: -16,
          nx: 8,
          ny: -24,
          fx: 14,
          fy: -10,
          sa: 1.0,
          bx: -6,
          by: -24,
          ffx: 9,
          ffy: -6,
          bfx: -10,
          bfy: -9,
        }),
      ],
      [0.3, POSES.fall],
    ],
  },
  /** curled into a ball, rolled over with his back to the camera, then opened up long with the blade overhead */
  airFlip: {
    dur: 0.36,
    hit: 0.1,
    keys: [
      [0, BALL],
      [frame(1), { ...BALL, tw: 1 }, "snap"],
      [
        frame(2),
        pose({ hy: -15, nx: 2, ny: -26, fx: 8, fy: -34, sa: -1.1, bx: -5, by: -33, ffx: 1, ffy: 0, bfx: -2, bfy: 1 }),
        "snap",
      ],
      [frame(5), pose({ hy: -15, nx: 2, ny: -26, fx: 4, fy: -36, sa: -1.8, bx: -5, by: -33, ffx: 1, bfx: -2, bfy: 1 })],
      [0.36, POSES.fall],
    ],
  },
  /** flat out in the air like a spear, three stabs with the arm drawn back between them */
  airDrill: {
    dur: 0.36,
    hit: 0.06,
    keys: [
      [0, pose({ ...FLAT, nx: 6, ny: -20, fx: 2, fy: -18, sa: 0.2 })],
      [frame(1), pose({ ...FLAT, fx: 20, fy: -18, sa: 0.1 }), "snap"],
      [frame(2), pose({ ...FLAT, fx: 12, fy: -17, sa: 0.15 })],
      [frame(3), pose({ ...FLAT, fx: 20, fy: -16, sa: 0.2 }), "snap"],
      [frame(4), pose({ ...FLAT, fx: 12, fy: -17, sa: 0.15 })],
      [frame(5), pose({ ...FLAT, nx: 9, fx: 21, fy: -17, sa: 0.15 }), "snap"],
      [frame(8), pose({ ...FLAT, nx: 9, fx: 20, fy: -17, sa: 0.2 })],
      [0.36, POSES.fall],
    ],
  },
  /** arched far back with both hands over the head, then jackknifed forward to hammer the blade straight down */
  airHammer: {
    dur: 0.46,
    hit: 0.16,
    keys: [
      [
        0,
        pose({
          hy: -16,
          nx: -3,
          ny: -26,
          fx: -4,
          fy: -35,
          sa: -2.2,
          bx: -3,
          by: -34,
          ffx: -1,
          ffy: -6,
          bfx: -5,
          bfy: -4,
        }),
      ],
      [
        frame(3),
        pose({
          hy: -16,
          nx: -4,
          ny: -26,
          fx: -7,
          fy: -34,
          sa: -2.6,
          bx: -6,
          by: -33,
          ffx: -2,
          ffy: -7,
          bfx: -6,
          bfy: -5,
        }),
      ],
      [
        frame(4),
        pose({ hy: -16, nx: 8, ny: -21, fx: 14, fy: -6, sa: 1.3, bx: 12, by: -7, ffx: 4, ffy: -2, bfx: -4 }),
        "snap",
      ],
      [frame(9), pose({ hy: -16, nx: 8, ny: -21, fx: 14, fy: -5, sa: 1.4, bx: 12, by: -6, ffx: 4, ffy: -2, bfx: -4 })],
      [0.46, POSES.fall],
    ],
  },
  /** knees tucked, turning on the spot in the air: a cut in front, his back, a cut behind, his back, a cut in front */
  spin: {
    dur: 0.36,
    hit: 0.06,
    keys: [
      [0, pose({ ...TUCK, fx: -4, fy: -18, sa: 3.0, bx: 4, by: -18 })],
      [frame(1), WHIRL_CUT, "snap"],
      [frame(3), WHIRL_BACK, "snap"],
      [frame(4), { ...WHIRL_CUT, mr: 1 }, "snap"],
      [frame(5), WHIRL_BACK, "snap"],
      [frame(6), WHIRL_CUT, "snap"],
      [0.36, POSES.fall],
    ],
  },
  /** curled up with the blade raised, then straightened into a dive, point down below the feet */
  plunge: {
    dur: 0.3,
    hit: 0.1,
    keys: [
      [
        0,
        pose({
          hy: -17,
          nx: -2,
          ny: -27,
          fx: 3,
          fy: -34,
          sa: -1.4,
          bx: -3,
          by: -31,
          ffx: 4,
          ffy: -9,
          bfx: -3,
          bfy: -7,
        }),
      ],
      [
        frame(3),
        pose({
          hx: 1,
          hy: -16,
          nx: 3,
          ny: -26,
          fx: 5,
          fy: -11,
          sa: 1.57,
          bx: 4,
          by: -12,
          ffx: 1,
          ffy: 0,
          bfx: -1,
          bfy: 1,
        }),
        "snap",
      ],
      [
        0.3,
        pose({
          hx: 1,
          hy: -16,
          nx: 3,
          ny: -26,
          fx: 5,
          fy: -10,
          sa: 1.57,
          bx: 4,
          by: -11,
          ffx: 1,
          ffy: 0,
          bfx: -1,
          bfy: 1,
        }),
      ],
    ],
  },
} satisfies Record<string, ActionClip>;
