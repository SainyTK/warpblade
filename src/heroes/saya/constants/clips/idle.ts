import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";
import { SAYA_POSES } from "./poses";

const R = SAYA_POSES.rest;

/** the rest pose at breath b, 0 breathed out and 1 in: the chest and shoulders lift under a pixel, the hands stay */
const breath = (b: number): Pose =>
  pose({ ...R, ny: lerp(R.ny + 0.25, R.ny - 0.45, b), nx: lerp(R.nx, R.nx + 0.2, b), cb: lerp(R.cb, R.cb + 0.3, b) });

/** one slow breath on every second frame, in and out, so the loop's wrap is no bigger than any other step */
const BREATH = [0, 0.15, 0.4, 0.7, 0.9, 1, 1, 0.9, 0.7, 0.45, 0.25, 0.1, 0.02, 0] as const;

/** Saya at rest, breathing slowly with her thumb on the guard; it loops */
export const SAYA_IDLE: ActionClip = {
  dur: frame(BREATH.length * 2),
  hit: 0,
  keys: BREATH.map((b, i): PoseKeyframe => [frame(i * 2), breath(b)]),
};

/** Saya hurt and short of breath: bent over with the sword hand braced on the hilt and the far hand at her ribs, quick
 *  breaths that lift the shoulders */
const hurtBreath = (b: number): Pose =>
  pose({
    ...R,
    hx: -0.8,
    hy: lerp(-12, -12.4, b),
    cb: lerp(-1.8, -1.1, b),
    nx: lerp(3.4, 2.8, b),
    ny: lerp(-20.8, -22, b),
    fx: 6.2,
    fy: -15.6,
    bx: lerp(1.4, 1.2, b),
    by: lerp(-17.6, -18.4, b),
    ffx: 4.4,
    bfx: -4.2,
  });

const HURT_BREATHS = [0, 0.35, 0.75, 1, 0.85, 0.6, 0.3, 0.1, 0.4, 0.8, 1, 0.7, 0.35, 0.05] as const;

/** her idle at low HP, in place of the calm one; it loops */
export const SAYA_WOUNDED_IDLE: ActionClip = {
  dur: frame(HURT_BREATHS.length * 2),
  hit: 0,
  keys: HURT_BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), hurtBreath(b)]),
};

/** the crouch a jump loads into from a stand: knees bent, the hand settling on the hilt */
export const SAYA_CROUCH: Pose = pose({ ...R, hy: -11.6, nx: 1, ny: -21.4, cb: 0.8, fx: 6, fy: -14.6, ffx: 4.4 });
