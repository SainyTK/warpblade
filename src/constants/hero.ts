import type { ClipName } from "../types/hero";
import type { ActionClip, Pose } from "../types/pose";
import { HERO_COLORS as HC } from "./palette";

/** Kael's head, facing right, three-quarters: swept silver hair, bangs over the brow, face on the right. */
export const HEAD = [
  "..dhhhh...",
  ".dhHHHHh..",
  "dhHHHHHHh.",
  "dhHHhHHHHh",
  "dhhHHhHhHh",
  "ddhhsShshs",
  "ddhssSssEs",
  ".dhsssssss",
  ".d..sSsss.",
  "....sSSs..",
] as const;
export const HEAD_MAP: Record<string, number> = {
  d: HC.hairDark,
  h: HC.hair,
  H: HC.hairLight,
  s: HC.skin,
  S: HC.skinShade,
  E: HC.eye,
};

/** limb lengths in pixels */
export const BODY = { upperArm: 5.5, foreArm: 5.5, thigh: 7.5, shin: 7, bladeLength: 17 } as const;

export const STAND: Pose = {
  hx: 0,
  hy: -14,
  nx: 1,
  ny: -24,
  fx: 6,
  fy: -15,
  bx: -3,
  by: -15,
  ffx: 3,
  ffy: 0,
  bfx: -3,
  bfy: 0,
  sa: 1.15,
};
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
export const READY = pose({ fx: 7, fy: -17, sa: 0.55, bx: -3, by: -16, ffx: 4, bfx: -4 });

export const POSES = {
  jump: pose({ hy: -15, nx: 2, ny: -25, ffx: 4, ffy: -5, bfx: -3, bfy: -2, fx: 6, fy: -21, sa: -0.7, bx: -6, by: -20 }),
  fall: pose({ ffx: 3, ffy: -1, bfx: -4, bfy: -3, fx: 8, fy: -19, sa: 0.9, bx: -7, by: -21, nx: 2 }),
  dodge: pose({
    hx: 1,
    hy: -11,
    nx: 7,
    ny: -20,
    fx: -4,
    fy: -12,
    sa: 2.8,
    bx: -6,
    by: -14,
    ffx: 6,
    ffy: -1,
    bfx: -8,
    bfy: -2,
  }),
  hurt: pose({ hx: -1, hy: -13, nx: -3, ny: -22, fx: 4, fy: -19, sa: -0.6, bx: -6, by: -22, ffx: 4, bfx: -4 }),
  kneel: pose({ hx: -1, hy: -8, nx: 1, ny: -17, fx: 8, fy: -9, sa: 1.45, bx: 2, by: -10, ffx: 5, bfx: -5 }),
  warpFly: pose({ hy: -15, nx: 6, fx: -6, fy: -18, bx: -8, by: -20, ffx: -2, ffy: -3, bfx: -7, bfy: -5, sa: 3 }),
  throwHold: pose({ fx: 13, fy: -22, sa: -0.15, nx: 4, hx: 1, bx: -5, by: -18, ffx: 6, bfx: -5 }),
  hang: pose({ nx: 0, fx: 2, fy: -38, sa: -Math.PI / 2, bx: -1, by: -35, ffx: 2, bfx: -2, bfy: 1 }),
  /** the ultimate gathering: low stance, blade held upright in both hands */
  charge: pose({ hy: -12, nx: 2, ny: -22, fx: 5, fy: -18, sa: -1.5, bx: 4, by: -17, ffx: 6, bfx: -6 }),
  /** the ultimate let loose: blade thrust at the sky */
  release: pose({ hy: -15, nx: 2, ny: -25, fx: 4, fy: -33, sa: -1.55, bx: -6, by: -22, ffx: 5, bfx: -5 }),
} as const;

/**
 * Keyed actions. Every blow winds up the opposite way, snaps to a new silhouette on the hit frame and follows through.
 */
export const CLIPS = {
  atk1: {
    dur: 0.34,
    hit: 0.09,
    keys: [
      [0, pose({ fx: -3, fy: -27, sa: -2.5, nx: -1, hx: -1, bx: 3, by: -20, ffx: 4, bfx: -4 })],
      [0.06, pose({ fx: -4, fy: -28, sa: -2.6, nx: -2, hx: -1, hy: -13, bx: 3, by: -20, ffx: 4, bfx: -4 })],
      [0.09, pose({ fx: 11, fy: -19, sa: 0.15, nx: 4, hx: 1, hy: -13, bx: -5, by: -19, ffx: 7, bfx: -5 }), "snap"],
      [0.16, pose({ fx: 9, fy: -12, sa: 1.0, nx: 3, hx: 1, hy: -13, bx: -6, by: -18, ffx: 7, bfx: -5 })],
      [0.34, READY],
    ],
  },
  atk2: {
    dur: 0.34,
    hit: 0.09,
    keys: [
      [0, pose({ fx: 9, fy: -8, sa: 1.5, nx: 3, hy: -12, ny: -22, bx: -4, by: -17, ffx: 5, bfx: -5 })],
      [0.06, pose({ fx: 8, fy: -7, sa: 1.6, nx: 3, hy: -11, ny: -21, bx: -4, by: -16, ffx: 5, bfx: -5 })],
      [
        0.09,
        pose({ fx: 5, fy: -31, sa: -1.3, nx: 2, hy: -15, ny: -25, bx: -5, by: -21, ffx: 4, ffy: -1, bfx: -4 }),
        "snap",
      ],
      [0.16, pose({ fx: 2, fy: -30, sa: -1.9, nx: 1, hy: -15, ny: -25, bx: -5, by: -21, ffx: 4, bfx: -4 })],
      [0.34, READY],
    ],
  },
  atk3: {
    dur: 0.5,
    hit: 0.16,
    keys: [
      [0, pose({ fx: -4, fy: -31, sa: -2.0, bx: -2, by: -30, hy: -15, nx: -1, ny: -25 })],
      [0.12, pose({ fx: -6, fy: -33, sa: -2.3, bx: -4, by: -32, hy: -16, nx: -2, ny: -26, ffx: 4, ffy: -2 })],
      [
        0.16,
        pose({ fx: 13, fy: -10, sa: 0.9, bx: 10, by: -12, hx: 2, hy: -11, nx: 6, ny: -21, ffx: 9, bfx: -6 }),
        "snap",
      ],
      [0.32, pose({ fx: 13, fy: -9, sa: 1.0, bx: 10, by: -11, hx: 2, hy: -11, nx: 6, ny: -21, ffx: 9, bfx: -6 })],
      [0.5, READY],
    ],
  },
  /** a straight lunge: the arm draws back, then the blade drives forward level */
  thrust: {
    dur: 0.3,
    hit: 0.08,
    keys: [
      [0, pose({ hx: -1, hy: -13, nx: -1, ny: -23, fx: -2, fy: -17, sa: 0.05, bx: 2, by: -19, ffx: 4, bfx: -5 })],
      [0.06, pose({ hx: -1, hy: -13, nx: -2, ny: -23, fx: -4, fy: -17, sa: 0, bx: 2, by: -19, ffx: 4, bfx: -5 })],
      [
        0.08,
        pose({ hx: 2, hy: -12, nx: 6, ny: -21, fx: 15, fy: -17, sa: -0.05, bx: -7, by: -18, ffx: 9, bfx: -6 }),
        "snap",
      ],
      [0.18, pose({ hx: 2, hy: -12, nx: 6, ny: -21, fx: 14, fy: -17, sa: 0, bx: -7, by: -18, ffx: 9, bfx: -6 })],
      [0.3, READY],
    ],
  },
  /** a crouching cut along the floor */
  sweep: {
    dur: 0.36,
    hit: 0.1,
    keys: [
      [0, pose({ hx: -1, hy: -9, nx: 0, ny: -18, fx: -5, fy: -8, sa: 2.6, bx: 3, by: -12, ffx: 5, bfx: -6 })],
      [0.07, pose({ hx: -1, hy: -9, nx: 0, ny: -18, fx: -6, fy: -7, sa: 2.75, bx: 3, by: -12, ffx: 5, bfx: -6 })],
      [0.1, pose({ hx: 2, hy: -8, nx: 5, ny: -17, fx: 12, fy: -4, sa: 0.1, bx: -6, by: -12, ffx: 9, bfx: -7 }), "snap"],
      [0.2, pose({ hx: 2, hy: -8, nx: 5, ny: -17, fx: 11, fy: -4, sa: 0.3, bx: -6, by: -12, ffx: 9, bfx: -7 })],
      [0.36, READY],
    ],
  },
  /** low, then up on the toes with the blade at the sky */
  uppercut: {
    dur: 0.4,
    hit: 0.1,
    keys: [
      [0, pose({ hy: -11, nx: 2, ny: -20, fx: 4, fy: -6, sa: 2.0, bx: -4, by: -14, ffx: 5, bfx: -5 })],
      [0.07, pose({ hy: -10, nx: 2, ny: -19, fx: 3, fy: -5, sa: 2.2, bx: -4, by: -13, ffx: 5, bfx: -5 })],
      [
        0.1,
        pose({ hx: 1, hy: -16, nx: 3, ny: -26, fx: 7, fy: -33, sa: -1.35, bx: -6, by: -20, ffx: 4, ffy: -2, bfx: -3 }),
        "snap",
      ],
      [
        0.2,
        pose({ hx: 1, hy: -16, nx: 3, ny: -26, fx: 6, fy: -34, sa: -1.6, bx: -6, by: -20, ffx: 4, ffy: -1, bfx: -3 }),
      ],
      [0.4, READY],
    ],
  },
  /** the blade swung flat around the body: front, back, front */
  spin: {
    dur: 0.36,
    hit: 0.06,
    keys: [
      [0, pose({ fx: -2, fy: -19, sa: 3.0, bx: 4, by: -18, ffx: 4, bfx: -4 })],
      [0.06, pose({ fx: 12, fy: -18, sa: 0, bx: -6, by: -18, nx: 2, ffx: 5, bfx: -5 }), "snap"],
      [0.14, pose({ fx: -10, fy: -18, sa: Math.PI, bx: 6, by: -18, nx: 0, ffx: 3, bfx: -6 }), "snap"],
      [0.22, pose({ fx: 12, fy: -18, sa: 0, bx: -6, by: -18, nx: 2, ffx: 5, bfx: -5 }), "snap"],
      [0.36, READY],
    ],
  },
  /** blade raised, then turned point down with the knees drawn up for the fall */
  plunge: {
    dur: 0.3,
    hit: 0.1,
    keys: [
      [
        0,
        pose({ hy: -16, nx: 1, ny: -26, fx: 4, fy: -28, sa: -1.4, bx: -5, by: -22, ffx: 4, ffy: -6, bfx: -3, bfy: -4 }),
      ],
      [
        0.1,
        pose({ hy: -16, nx: 2, ny: -26, fx: 5, fy: -13, sa: 1.5, bx: -5, by: -22, ffx: 3, ffy: -7, bfx: -4, bfy: -5 }),
        "snap",
      ],
      [
        0.3,
        pose({ hy: -16, nx: 2, ny: -26, fx: 5, fy: -12, sa: 1.55, bx: -5, by: -22, ffx: 3, ffy: -7, bfx: -4, bfy: -5 }),
      ],
    ],
  },
  /** a cut on the way into a back flip */
  flip: {
    dur: 0.42,
    hit: 0.05,
    keys: [
      [0, pose({ fx: 11, fy: -19, sa: 0.2, nx: 3, hx: 1, bx: -5, by: -19, ffx: 6, bfx: -5 })],
      [
        0.05,
        pose({ fx: 8, fy: -27, sa: -0.9, nx: -2, ny: -24, hx: -1, bx: -7, by: -22, ffx: 5, ffy: -6, bfx: -2, bfy: -4 }),
        "snap",
      ],
      [0.42, POSES.fall],
    ],
  },
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
} satisfies Record<ClipName, ActionClip>;
