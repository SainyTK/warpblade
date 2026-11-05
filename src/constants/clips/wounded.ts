import type { ActionClip, Pose, PoseKeyframe } from "../../types/pose";
import { lerp } from "../../utils/math";
import { frame, pose } from "../hero";

/**
 * Kael hurt and short of breath: hunched over his sword with its point planted in the floor ahead, his weight on it,
 * knees sagging and the far hand pressed to his ribs. b is the breath, 0 breathed out and 1 a full breath in: the
 * shoulders lift and the back straightens a little on each one, while the sword hand stays put so the point holds the floor.
 */
const lean = (b: number): Pose =>
  pose({
    hx: -0.5,
    hy: lerp(-11.75, -12.25, b),
    cb: lerp(-2, -1, b),
    nx: lerp(4, 3.25, b),
    ny: lerp(-20.5, -22, b),
    fx: 7,
    fy: -17.5,
    sa: 1.47,
    bx: lerp(1.5, 1.25, b),
    by: lerp(-17.25, -18.25, b),
    ffx: 4,
    bfx: -4.5,
  });

/** the breath on every second frame: two quick, heavy breaths, the second catching on the way out */
const BREATHS = [
  0, 0.3, 0.7, 0.95, 1, 0.9, 0.72, 0.52, 0.32, 0.14, 0.03, 0.32, 0.72, 0.95, 1, 0.82, 0.88, 0.55, 0.28, 0.08,
] as const;

/** Kael's idle at low HP, in place of his calm one; it loops, and its last key flows into the first */
export const KAEL_WOUNDED_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), lean(b)]),
};
