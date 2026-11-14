import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";

/**
 * Vesper at rest, weight on the back leg and the hip cocked: the long blade hangs from the near hand across the front of
 * her legs with its point trailing low behind her, and the short blade hangs reverse-gripped by the far hip. b is the
 * breath, 0 out and 1 in: the chest lifts and the sword hand sways a little, both under a pixel a frame.
 */
const rest = (b: number): Pose =>
  pose({
    hx: lerp(-1, -1.2, b),
    hy: lerp(-14, -14.4, b),
    cb: lerp(0.4, 0.8, b),
    nx: lerp(-0.2, -0.4, b),
    ny: lerp(-24, -24.5, b),
    fx: lerp(4.5, 4.3, b),
    fy: lerp(-13.5, -13.8, b),
    sa: lerp(2.45, 2.42, b),
    bx: lerp(-5, -5.1, b),
    by: lerp(-14, -14.3, b),
    oa: 1.95,
    ffx: 3.5,
    fa: 0.15,
    bfx: -3.5,
  });

/** the breath on every fourth frame, slow and even, the last flowing into the first */
const BREATHS = [0, 0.25, 0.6, 0.9, 1, 0.9, 0.65, 0.4, 0.2, 0.05] as const;

export const IDLE_CLIP: ActionClip = {
  dur: frame(BREATHS.length * 4),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 4), rest(b)]),
};

/** short of breath: bent over the long blade with its point planted ahead, the short blade hanging; quick breaths */
const winded = (b: number): Pose =>
  pose({
    hx: -0.5,
    hy: lerp(-11.5, -12.2, b),
    cb: lerp(-2, -1, b),
    nx: lerp(4.2, 3.4, b),
    ny: lerp(-20.2, -21.8, b),
    fx: 7.5,
    fy: -16.5,
    sa: 1.5,
    bx: lerp(-2.5, -2.8, b),
    by: lerp(-13, -13.8, b),
    oa: 1.6,
    ffx: 4.5,
    bfx: -4.5,
  });

const PANTS = [0, 0.35, 0.8, 1, 0.85, 0.55, 0.25, 0.05, 0.4, 0.85, 1, 0.7, 0.3, 0.08] as const;

export const WOUNDED_CLIP: ActionClip = {
  dur: frame(PANTS.length * 2),
  hit: 0,
  keys: PANTS.map((b, i): PoseKeyframe => [frame(i * 2), winded(b)]),
};
