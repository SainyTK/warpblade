import { pose } from "../../../../constants/hero";
import { fitRunFeet } from "../../../../drill";
import type { DrillProfile } from "../../../../types/drill";
import type { Pose } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { grip, shouldered } from "../clips/grip";
import { BRYNN_HELD_CLIPS } from "../clips/held";
import { BRYNN_READY } from "../clips/key";
import { BRYNN_LOCOMOTION } from "../clips/locomotion";
import { BRYNN_WARP_POSES } from "./warp";

function upperBody(phase: number): Pose {
  const { keys, dur } = BRYNN_LOCOMOTION.run;
  const p = sampleKeys(keys, phase * dur);
  return { ...p, hy: p.hy + 0.8, ny: p.ny + 0.9 };
}

let fitted: ((phase: number) => Pose) | undefined;

const run = (phase: number): Pose => {
  fitted ??= fitRunFeet(upperBody);
  return fitted(phase);
};

const STANCE = grip({ ...BRYNN_READY, hy: -12.2, ny: -22.3, ffx: 6.5, bfx: -6.5, ba: 0.3 });
const LOW = grip({ hx: 0, hy: -7.5, cb: 1, nx: 4, ny: -16.5, fx: 10, fy: -9, sa: 1.25, ffx: 8, bfx: -8.5, ba: 0.5 });
const DASH = shouldered(
  pose({ hx: -3, hy: -9.5, cb: 1, nx: 6, ny: -17.5, bx: 10, by: -14, be: 0, ffx: 9, bfx: -12, bfy: -1.5, ba: 0.9 }),
);
const RISE = shouldered(
  pose({
    hy: -14.5,
    cb: 0.3,
    nx: 1.5,
    ny: -24.5,
    bx: -4,
    by: -16,
    be: 1,
    ffx: 5.5,
    ffy: -7,
    fa: 0.4,
    bfx: -4,
    bfy: -2,
  }),
  1,
);
const LEAP = grip({
  hx: -1,
  hy: -14,
  cb: -0.6,
  nx: 1,
  ny: -24.5,
  fx: 1,
  fy: -32,
  sa: -2.35,
  ffx: 6,
  ffy: -7,
  fa: 0.35,
  bfx: -9,
  bfy: -2,
  ba: 0.7,
});
const FALL = grip({
  hx: 0,
  hy: -15,
  cb: -0.4,
  nx: 1,
  ny: -25,
  fx: 3,
  fy: -30.5,
  sa: -1.9,
  ffx: 4,
  ffy: -2,
  fa: 0.3,
  bfx: -4.5,
  bfy: -4,
  ba: 0.5,
});
const GUARD = grip({
  hx: -2.5,
  hy: -11,
  cb: -0.4,
  nx: -1,
  ny: -21,
  fx: 7,
  fy: -12.5,
  sa: -1.5,
  ffx: 8,
  bfx: -8,
  ba: 0.4,
});
const PARRY_CONTACT = grip({
  hx: -3,
  hy: -11.5,
  cb: -0.8,
  nx: -2.5,
  ny: -21.5,
  fx: 6,
  fy: -24,
  sa: -2.1,
  ffx: 7,
  bfx: -9,
  ba: 0.5,
});

export const BRYNN_BODY: Pick<DrillProfile, "motion" | "poses"> = {
  motion: {
    run: 100,
    groundAccel: 2500,
    groundBrake: 3000,
    rise: 312,
    fallGravity: 1330,
    fall: 410,
    dash: 262,
    dashJump: 206,
    wallKick: 166,
    wallSlide: 70,
    landing: 1.35,
  },
  poses: {
    ...BRYNN_WARP_POSES,
    run,
    stance: STANCE,
    breathe: { ...STANCE, hy: -11.6, ny: -21.6, fy: STANCE.fy + 0.6, by: STANCE.by + 0.6, cb: 0.45 },
    brake: grip({
      hx: -5,
      hy: -9.5,
      cb: -0.8,
      nx: -3.5,
      ny: -19,
      fx: -5,
      fy: -11,
      sa: 2.65,
      ffx: 11,
      fa: -0.3,
      bfx: -6,
    }),
    low: LOW,
    touchdown: { ...LOW, hy: -10, ny: -19.5, fy: -12, cb: 0.4 },
    dash: DASH,
    airDash: { ...DASH, hy: -12, ny: -19.5, ffx: 5, ffy: -5, bfx: -13, bfy: -4, fa: 0.6 },
    rise: RISE,
    leap: LEAP,
    kick: grip({
      hx: -2,
      hy: -13,
      cb: 0.5,
      nx: 3,
      ny: -23,
      fx: 12,
      fy: -22,
      sa: -0.55,
      ffx: 6,
      ffy: -4,
      bfx: -13,
      bfy: -8,
      ba: 1.1,
    }),
    fall: FALL,
    wall: shouldered(
      pose({
        hx: -4,
        hy: -12,
        cb: -0.6,
        nx: -2,
        ny: -22,
        bx: 6,
        by: -21,
        be: 0,
        ffx: 6,
        ffy: -7,
        bfx: 4,
        bfy: -1,
        fa: -0.68,
      }),
    ),
    guard: GUARD,
    airGuard: { ...GUARD, ffy: -5, bfy: -4, fa: 0.3, ba: 0.6 },
    parryContact: PARRY_CONTACT,
    parryReturn: grip({ hx: 3, hy: -9.5, cb: 1.3, nx: 8.5, ny: -18.5, fx: 17, fy: -11, sa: 0.62, ffx: 11, bfx: -8.5 }),
    spell: shouldered(
      pose({ hx: -2, hy: -12, cb: 0.4, nx: 1.5, ny: -22, bx: 15, by: -19, be: 0, ffx: 8, bfx: -7, ba: 0.3 }),
    ),
    skillWindup: BRYNN_HELD_CLIPS.charge.keys[0][1],
    skillCut: grip({ hx: 3, hy: -8.5, cb: 1.4, nx: 9, ny: -17, fx: 17, fy: -8, sa: 1.05, ffx: 12, bfx: -9, ba: 0.6 }),
  },
};
