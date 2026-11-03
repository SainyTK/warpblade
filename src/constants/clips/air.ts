import type { ActionClip, Pose } from "../../types/pose";
import { frame, POSES, pose } from "../hero";

/** knees drawn up under him, as in a jump */
const TUCK = { hy: -16, ffx: 4, ffy: -6, bfx: -3, bfy: -4 } as const;
/** curled into a ball for the wheel, the blade wound high behind */
const WHEEL_BALL: Pose = pose({
  hy: -18,
  nx: -3,
  ny: -26,
  fx: -7,
  fy: -28,
  sa: -2.5,
  bx: -2,
  by: -22,
  ffx: 3,
  ffy: -12,
  bfx: -2,
  bfy: -10,
});
/** the blade swung flat in front at chest height, for the whirlwind's turns */
const WHIRL_CUT: Pose = pose({ ...TUCK, nx: 2, ny: -26, fx: 13, fy: -19, sa: 0, bx: -6, by: -19 });
/** back to the camera mid-turn, the blade carried overhead */
const WHIRL_BACK: Pose = pose({ ...TUCK, nx: 0, ny: -26, fx: -2, fy: -23, sa: -1.6, bx: 3, by: -20, tw: 1 });
/** legs driven straight down and both arms flung up, the stomp's dive */
const STOMP_DIVE: Pose = pose({ hy: -14, nx: 0, ny: -24, fx: 9, fy: -33, sa: -1.0, bx: -8, by: -32, ffx: 2, bfx: -2 });

/**
 * The air string, the whirlwind and the meteor drop. None of these shapes appears on the ground: the wheel rolls
 * Kael over in a ball with the blade circling his whole body, the scissor cut lays him back with one leg kicked high
 * and the blade passing under his feet, and the stomp drops him feet first with his arms thrown up.
 */
export const AIR_CLIPS = {
  /** curled into a ball with the blade high behind, rolled over with his back to the camera, stretched out long with
   *  the legs kicked up behind as the blade comes round in front, then tucked again as it passes under him */
  airWheel: {
    dur: 0.4,
    hit: frame(2),
    keys: [
      [0, WHEEL_BALL],
      [frame(1), { ...WHEEL_BALL, fx: 1, fy: -35, sa: -1.3, tw: 1 }, "snap"],
      [
        frame(2),
        pose({
          hx: -1,
          hy: -17,
          nx: 7,
          ny: -21,
          fx: 15,
          fy: -16,
          sa: 0.6,
          bx: 2,
          by: -17,
          ffx: -9,
          ffy: -16,
          bfx: -12,
          bfy: -12,
        }),
        "snap",
      ],
      [
        frame(4),
        pose({ hy: -17, nx: 5, ny: -23, fx: 8, fy: -7, sa: 1.9, bx: -1, by: -18, ffx: 1, ffy: -9, bfx: -4, bfy: -7 }),
      ],
      [frame(6), { ...WHEEL_BALL, fx: -6, fy: -10, sa: 2.7, tw: 1 }, "snap"],
      [0.4, POSES.fall],
    ],
  },
  /** hunched forward with the blade low behind, then laid back in the air with the front leg kicked high, the blade
   *  swept under his feet and up in front */
  airScissor: {
    dur: 0.38,
    hit: frame(2),
    keys: [
      [
        0,
        pose({ hy: -17, nx: 3, ny: -26, fx: -7, fy: -9, sa: 2.5, bx: -3, by: -18, ffx: 4, ffy: -8, bfx: -3, bfy: -5 }),
      ],
      [
        frame(2),
        pose({
          hx: 1,
          hy: -15,
          nx: -5,
          ny: -23,
          fx: 14,
          fy: -24,
          sa: -0.9,
          bx: -9,
          by: -19,
          ffx: 11,
          ffy: -21,
          bfx: -3,
        }),
        "snap",
      ],
      [
        frame(5),
        pose({
          hx: 1,
          hy: -15,
          nx: -5,
          ny: -23,
          fx: 13,
          fy: -27,
          sa: -1.2,
          bx: -9,
          by: -20,
          ffx: 10,
          ffy: -22,
          bfx: -3,
        }),
      ],
      [0.38, POSES.fall],
    ],
  },
  /** knees pulled up to the chest with the blade reversed, point down, then the legs driven straight down and both
   *  arms flung up for the drop; the pose holds until he lands */
  airStomp: {
    dur: 0.3,
    hit: frame(3),
    keys: [
      [
        0,
        pose({
          hy: -19,
          nx: 0,
          ny: -29,
          fx: 6,
          fy: -24,
          sa: 1.57,
          bx: -5,
          by: -24,
          ffx: 4,
          ffy: -13,
          bfx: -3,
          bfy: -12,
        }),
      ],
      [frame(3), STOMP_DIVE, "snap"],
      [0.3, STOMP_DIVE],
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
