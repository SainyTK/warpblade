import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";
import { YUN_READY } from "./ready";

/** the ready stance at a breath, 0 breathed out and 1 a full breath in: the chest lifts, the sword fingers rise a little */
const breath = (b: number): Pose =>
  pose({
    ...YUN_READY,
    hy: lerp(-13.6, -13.85, b),
    ny: lerp(-23.6, -24.2, b),
    cb: lerp(-0.3, 0.1, b),
    by: lerp(-21.5, -22.1, b),
    bx: lerp(4.5, 4.8, b),
    fy: lerp(-15.5, -15.7, b),
  });

/** one slow breath every two seconds, keyed every second frame; the last key flows into the first */
const BREATHS = Array.from({ length: 30 }, (_, i) => 0.5 - 0.5 * Math.cos((i / 30) * Math.PI * 2));

/** Yun at rest: the ready stance breathing slowly. Its first frame is his stand on the hero screen */
export const YUN_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), breath(b)]),
};

/**
 * Yun hurt and short of breath: stooped, the far hand pressed to his ribs, the jian hanging loose and low behind his
 * leg. b is the breath: the shoulders lift and the back straightens a little on each one.
 */
const wounded = (b: number): Pose =>
  pose({
    hx: -1,
    hy: lerp(-12, -12.5, b),
    cb: lerp(-2.2, -1.2, b),
    nx: lerp(3.5, 2.8, b),
    ny: lerp(-20.8, -22.2, b),
    fx: 4,
    fy: lerp(-12.5, -13, b),
    sa: 1.95,
    bx: lerp(2, 1.6, b),
    by: lerp(-17.5, -18.5, b),
    ffx: 4.5,
    bfx: -4.5,
    ba: 0.2,
  });

/** two quick, heavy breaths, the second catching on the way out */
const HEAVY = [
  0, 0.3, 0.7, 0.95, 1, 0.9, 0.72, 0.52, 0.32, 0.14, 0.03, 0.32, 0.72, 0.95, 1, 0.82, 0.88, 0.55, 0.28, 0.08,
];

/** Yun's idle at low HP, in place of his calm one; it loops */
export const YUN_WOUNDED_IDLE: ActionClip = {
  dur: frame(HEAVY.length * 2),
  hit: 0,
  keys: HEAVY.map((b, i): PoseKeyframe => [frame(i * 2), wounded(b)]),
};
