import { frame, pose } from "../../../../constants/hero";
import type { Pose, PoseKeyframe } from "../../../../types/pose";

/** a key on animation frame `n`, changing only some joints of the stand; `snap` jumps to it on that frame */
export const key = (n: number, o: Partial<Pose>, snap = false): PoseKeyframe =>
  snap ? [frame(n), pose(o), "snap"] : [frame(n), pose(o)];

/** the shield on the far arm carried in front of the body, its point down */
export const SHIELD_UP = { bs: 1, oa: 1.5 } as const;

/**
 * The stance every blow of his string starts from and settles back to: sunk a little, the shield up in front of his
 * chest and the sword held low and forward beside it.
 */
export const STANCE = {
  ...SHIELD_UP,
  hx: 0,
  hy: -13.5,
  cb: 0.5,
  nx: 1.5,
  ny: -23.5,
  fx: 8,
  fy: -16,
  sa: 0.45,
  bx: 6,
  by: -17.5,
  ffx: 5,
  bfx: -5,
} as const;
