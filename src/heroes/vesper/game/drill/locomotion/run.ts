import { pose } from "../../../../../constants/hero";
import { cyclePhase, fitRunFeet, RUN_TOE_OFF } from "../../../../../drill";
import { clamp, smooth, TAU } from "../../../../../utils/math";

const SHORT_CARRY = 2.5;

function vesperUpperBody(phase: number) {
  const step = cyclePhase(phase * 2) / 2;
  const load = Math.sin(Math.PI * clamp(step / RUN_TOE_OFF)) ** 1.2;
  const flight = clamp((step - RUN_TOE_OFF) / (0.5 - RUN_TOE_OFF));
  const lift = 0.8 * 4 * flight * (1 - flight);
  const push = smooth(0.17, RUN_TOE_OFF, step) * (1 - smooth(RUN_TOE_OFF, 0.5, step));
  const hipX = -0.4 + 0.3 * Math.sin(phase * TAU);
  const hipY = -10.6 + 0.85 * load - 0.6 * push - lift;
  const drive = Math.cos((phase - 0.035) * TAU);
  const neckX = hipX + 7.2 + 1.2 * load;
  const neckY = hipY - 8.3;
  return pose({
    hx: hipX,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 0.9 + 0.5 * Math.cos((phase - 0.085) * TAU),
    fx: hipX - 4.6 - 1.4 * drive,
    fy: hipY - 3.8 + 0.6 * drive,
    sa: 2.92 + 0.08 * drive,
    bx: neckX + 0.4 + 6.4 * drive,
    by: neckY + 5.2 - 1.8 * drive,
    oa: SHORT_CARRY + 0.25 * drive,
  });
}

export const vesperRun = fitRunFeet(vesperUpperBody);
