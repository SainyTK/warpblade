import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose } from "../../../../types/pose";

/** the sword carried on the shoulder: the hand in front of the chest and the blade lying back across the shoulders */
export const CARRY = { fx: 5, fy: -19.5, sa: -2.6 } as const;

/** Calder at rest: weight sunk onto the back leg, the chamber sword on his shoulder, the far thumb hooked in his belt */
export const CALDER_STAND: Pose = pose({
  hx: -1,
  hy: -13.8,
  cb: 0.3,
  nx: 0,
  ny: -23.8,
  ...CARRY,
  bx: -2.5,
  by: -14.5,
  be: 1,
  ffx: 4,
  bfx: -4,
  ba: 0.15,
});

/** the stand with a breath in it: `b` 0 breathed out, 1 a full breath in; the blade rides the shoulder as it lifts */
const breath = (b: number, shift: number): Pose =>
  pose({
    ...CALDER_STAND,
    hx: CALDER_STAND.hx + shift,
    nx: CALDER_STAND.nx + shift * 0.6,
    ny: CALDER_STAND.ny - b * 0.6,
    cb: CALDER_STAND.cb + b * 0.3,
    fy: CALDER_STAND.fy - b * 0.5,
    sa: CALDER_STAND.sa - b * 0.03,
    by: CALDER_STAND.by - b * 0.3,
  });

/** two slow breaths, the second with the weight easing a little further back; the last key flows into the first */
export const CALDER_IDLE: ActionClip = {
  dur: frame(72),
  hit: 0,
  keys: [
    [0, breath(0, 0)],
    [frame(8), breath(0.5, 0)],
    [frame(16), breath(1, 0)],
    [frame(24), breath(0.6, -0.2)],
    [frame(32), breath(0.1, -0.4)],
    [frame(40), breath(0.5, -0.5)],
    [frame(48), breath(1, -0.5)],
    [frame(56), breath(0.6, -0.3)],
    [frame(64), breath(0.2, -0.1)],
  ],
};

/** the jump's load from a stand: he sinks over the back leg with the sword still on his shoulder */
export const CALDER_CROUCH: Pose = pose({
  ...CALDER_STAND,
  hx: -1.5,
  hy: -11,
  cb: 1,
  nx: 0.5,
  ny: -20.8,
  fy: -17,
  by: -12,
  ffx: 4.5,
  bfx: -4.5,
});
