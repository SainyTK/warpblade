import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";
import { AT_REST } from "./base";

/** a breath at rest, 0 out and 1 in: the chest lifts, the off elbow eases out and the point stirs by the foot */
const restAt = (b: number): Pose =>
  pose({
    ...AT_REST,
    ny: lerp(-24, -24.5, b),
    nx: lerp(-1, -0.8, b),
    cb: lerp(0.3, 0.5, b),
    fy: lerp(-14.5, -14.8, b),
    sa: lerp(1.05, 1.02, b),
  });
/** the breath on every second frame of a slow loop */
const BREATHS = [0, 0.1, 0.3, 0.55, 0.78, 0.93, 1, 0.96, 0.85, 0.7, 0.52, 0.36, 0.22, 0.12, 0.05, 0.01, 0, 0] as const;

/** Cerise at rest, her idle: the first frame is her stand on the hero screen; it loops, its last key flowing into the first */
export const CERISE_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), restAt(b)]),
};

/** hurt and short of breath: bent over the rapier with its point set on the floor ahead, the off hand pressed to the ribs */
const woundAt = (b: number): Pose =>
  pose({
    hx: -1,
    hy: lerp(-11.5, -12, b),
    cb: lerp(-1.8, -1, b),
    nx: lerp(3, 2.3, b),
    ny: lerp(-20.5, -21.8, b),
    fx: 8,
    fy: -12,
    sa: 1.25,
    bx: lerp(1.2, 1, b),
    by: lerp(-16.5, -17.5, b),
    ffx: 5,
    bfx: -4.5,
    ba: 0.2,
  });
/** two short breaths, the second catching */
const WOUND_BREATHS = [0, 0.35, 0.75, 1, 0.9, 0.65, 0.4, 0.15, 0.05, 0.4, 0.8, 1, 0.8, 0.86, 0.5, 0.2] as const;

/** Cerise's idle at low HP, in place of her rest */
export const CERISE_WOUNDED: ActionClip = {
  dur: frame(WOUND_BREATHS.length * 2),
  hit: 0,
  keys: WOUND_BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), woundAt(b)]),
};

/** the crouch a jump loads into from a stand: knees sunk, the point up, the off hand down for the push */
export const CERISE_CROUCH: Pose = pose({
  hx: -0.5,
  hy: -11,
  nx: 1,
  ny: -20.8,
  cb: 0.4,
  fx: 6,
  fy: -15.5,
  sa: -0.4,
  bx: -5,
  by: -15,
  ffx: 5,
  bfx: -4.5,
  ba: 0.2,
});
