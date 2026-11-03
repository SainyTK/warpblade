import type { Pose } from "../types/pose";
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
/** the back of Kael's head, for a spin: all hair, with the nape of the neck under it */
export const HEAD_BACK = [
  "..dhhhh...",
  ".dhHHhhh..",
  "dhHHhhhhd.",
  "dhHhhdhhhd",
  "dhhhdhhdhd",
  "ddhhdhhddd",
  "ddhdhhdhdd",
  ".ddhhdhdd.",
  "..ddhhdd..",
  "...dSSd...",
] as const;
export const HEAD_MAP: Record<string, number> = {
  d: HC.hairDark,
  h: HC.hair,
  H: HC.hairLight,
  s: HC.skin,
  S: HC.skinShade,
  E: HC.eye,
};

/** poses are sampled at this rate, so limbs move in pixel-art beats; keyframe times are whole frames of it */
export const ANIM_FPS = 30;
/** the time of this animation frame, in seconds */
export const frame = (n: number): number => n / ANIM_FPS;

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
  tw: 0,
  mr: 0,
};
/** a pose that changes only some joints of the standing pose */
export const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
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
