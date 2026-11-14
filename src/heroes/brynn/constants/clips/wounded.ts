import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";

/**
 * Brynn hurt: Anvilheart planted point down in the floor before her, both hands on the pommel and her weight hung on
 * it, head low. b is the breath, 0 out and 1 in: the shoulders lift and the back straightens a little, the hands hold.
 */
const lean = (b: number): Pose =>
  pose({
    hx: -1,
    hy: lerp(-12, -12.5, b),
    cb: lerp(-1.8, -0.9, b),
    nx: lerp(3.5, 2.8, b),
    ny: lerp(-20.6, -22, b),
    fx: 7.5,
    fy: -20,
    sa: 1.5,
    bx: 6.5,
    by: -21,
    ffx: 4,
    bfx: -5,
  });

/** two heavy breaths, the second catching on the way out */
const BREATHS = [0, 0.35, 0.75, 1, 0.95, 0.75, 0.5, 0.25, 0.05, 0.4, 0.8, 1, 0.85, 0.9, 0.55, 0.2] as const;

/** her idle at low HP; it loops, and its last key flows into the first */
export const BRYNN_WOUNDED_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), lean(b)]),
};
