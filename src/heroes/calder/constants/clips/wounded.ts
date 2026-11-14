import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";

/**
 * Calder hurt: the sword off his shoulder with its point dragging on the floor ahead, the far hand pressed to his side,
 * knees sagging. `b` is the breath, 0 out and 1 in: the shoulders lift and the head comes up a little on each one.
 */
const slump = (b: number): Pose =>
  pose({
    hx: -1,
    hy: lerp(-11.8, -12.3, b),
    cb: lerp(-1.8, -0.9, b),
    nx: lerp(3.2, 2.5, b),
    ny: lerp(-20.6, -22, b),
    fx: 7,
    fy: -15,
    sa: 0.92,
    bx: lerp(1, 0.6, b),
    by: lerp(-15.5, -16.4, b),
    ffx: 4.5,
    bfx: -4.5,
    ba: 0.2,
  });

/** a long heavy breath, then two short ones */
const BREATHS = [0, 0.25, 0.6, 0.9, 1, 0.9, 0.7, 0.45, 0.2, 0.05, 0.4, 0.8, 0.6, 0.85, 0.5, 0.15] as const;

/** Calder's idle at low HP, in place of his calm one; it loops, and its last key flows into the first */
export const CALDER_WOUNDED_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), slump(b)]),
};
