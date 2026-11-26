import { frontHand, rearHand } from "../../../../constants/drillPose";
import { pose } from "../../../../constants/hero";
import { fitRunFeet } from "../../../../drill";
import type { DrillPoses } from "../../../../types/drill";
import { clamp, TAU } from "../../../../utils/math";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { YUN_READY } from "../../constants/clips/ready";
import { YUN_WARP_CLIPS } from "../../constants/drill/warp";

const RUN_TOE_OFF = 0.46;

function runUpperBody(phase: number) {
  const step = phase * 2 - Math.floor(phase * 2);
  const load = Math.sin(Math.PI * clamp(step / RUN_TOE_OFF));
  const flight = clamp((step - RUN_TOE_OFF) / (1 - RUN_TOE_OFF));
  const hipX = -0.4 + 0.3 * Math.sin(phase * TAU);
  const hipY = -10.8 + 0.7 * load - 0.5 * 4 * flight * (1 - flight);
  const sway = Math.sin(phase * TAU);
  const neckX = hipX + 4.2 + 0.8 * load;
  const neckY = hipY - 9.2;
  return pose({
    hx: hipX,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 0.2 + 0.3 * sway,
    fx: hipX - 6.5,
    fy: hipY - 3.5 - 0.6 * sway,
    sa: 2.72 + 0.06 * sway,
    ...frontHand(neckX + 5.5, neckY + 3.2 - 0.8 * sway),
  });
}

const LOW = pose({
  hx: -1,
  hy: -9,
  nx: 2.5,
  ny: -18.6,
  fx: 9,
  fy: -11,
  ...rearHand(5, -18),
  ffx: 7,
  bfx: -7,
  sa: 0.45,
});
const DASH = pose({
  hx: -3,
  hy: -9.5,
  nx: 5,
  ny: -18.5,
  cb: 0.4,
  fx: -11,
  fy: -11,
  ...frontHand(12, -17),
  ffx: 8,
  ffy: 0,
  fa: 0.15,
  bfx: -13,
  bfy: -1,
  ba: 0.55,
  sa: 2.95,
});
const RISE = pose({
  hy: -14.5,
  nx: 1.5,
  ny: -24.5,
  fx: -7,
  fy: -21,
  ...frontHand(9, -25),
  ffx: 5,
  ffy: -9,
  fa: 0.55,
  bfx: -2,
  bfy: -1,
  ba: 0.35,
  sa: 2.35,
});
const LEAP = pose({
  hx: -2,
  hy: -13,
  nx: 5,
  ny: -22,
  fx: 13,
  fy: -19,
  ...rearHand(-7, -22),
  ffx: 7,
  ffy: -9,
  fa: 0.4,
  bfx: -12,
  bfy: -3,
  ba: 0.9,
  sa: -0.05,
});
const GUARD = pose({
  hx: -2,
  hy: -12,
  nx: 0,
  ny: -22,
  fx: 8,
  fy: -17,
  ...frontHand(6, -21),
  ffx: 8,
  bfx: -7,
  sa: -1.57,
});
const PARRY_CONTACT = pose({
  hx: -1,
  hy: -11,
  nx: 3,
  ny: -21,
  fx: 12,
  fy: -21,
  ...rearHand(2, -19),
  ffx: 9,
  bfx: -8,
  sa: -0.62,
});

export const YUN_POSES: Partial<DrillPoses> = {
  stance: YUN_READY,
  breathe: { ...YUN_READY, hy: -13.1, ny: -23, by: -21, fy: -15.1 },
  run: fitRunFeet(runUpperBody),
  brake: pose({ hx: -4, hy: -10.5, nx: -1, ny: -20.5, fx: 8, fy: -14, ...rearHand(5, -20), ffx: 10, bfx: -7, sa: 0.6 }),
  low: LOW,
  touchdown: { ...LOW, hy: -12, nx: 1.5, ny: -21.8, fy: -15, by: -22, fa: -0.2 },
  dash: DASH,
  airDash: { ...DASH, hy: -11.5, ny: -20.5, ffx: 2, ffy: -6, bfx: -13, bfy: -4, fa: 0.55, ba: 0.95, by: -20 },
  rise: RISE,
  leap: LEAP,
  kick: { ...LEAP, bfx: -12, bfy: -9, ba: 1.2, ffy: -4, ...frontHand(9, -24) },
  fall: pose({
    hy: -14.5,
    nx: 0.5,
    ny: -24.5,
    fx: 9,
    fy: -20,
    ...rearHand(-6, -22),
    ffx: 3,
    ffy: -3,
    fa: 0.35,
    bfx: -3,
    bfy: -1,
    ba: 0.25,
    sa: 0.95,
  }),
  wall: pose({
    hx: -4,
    hy: -12.5,
    nx: -1.5,
    ny: -22.5,
    fx: -9,
    fy: -17,
    ...frontHand(6, -24),
    ffx: 5,
    ffy: -8,
    bfx: 4,
    bfy: -1,
    fa: -0.6,
    sa: 2.6,
  }),
  guard: GUARD,
  airGuard: { ...GUARD, ffy: -5, bfy: -4, fa: 0.23, ba: 0.55 },
  parryContact: PARRY_CONTACT,
  parryReturn: { ...PARRY_CONTACT, hx: 2, nx: 6, fx: 15, fy: -14, ...rearHand(-6, -20), sa: 0.35 },
  spell: pose({ hx: -1, hy: -13, nx: 2, ny: -23, fx: -4, fy: -17, ...frontHand(15, -21), ffx: 7, bfx: -6, sa: -1.3 }),
  warpThrow: (age) => sampleKeys(YUN_WARP_CLIPS.throw.keys, age),
  warpFlight: (age) => sampleKeys(YUN_WARP_CLIPS.flight.keys, age % YUN_WARP_CLIPS.flight.dur),
  warpArrival: (age) => sampleKeys(YUN_WARP_CLIPS.arrival.keys, age),
};
