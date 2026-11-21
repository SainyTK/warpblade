import { pose } from "../../../../constants/hero";
import { cyclePhase, fitRunFeet, RUN_TOE_OFF } from "../../../../drill";
import { clamp, TAU } from "../../../../utils/math";

function dervishUpperBody(phase: number) {
  const step = cyclePhase(phase * 2) / 2;
  const load = Math.sin(Math.PI * clamp(step / RUN_TOE_OFF)) ** 1.2;
  const flight = clamp((step - RUN_TOE_OFF) / (0.5 - RUN_TOE_OFF));
  const lift = 0.7 * 4 * flight * (1 - flight);
  const hipX = -0.4 + 0.3 * Math.sin(phase * TAU);
  const hipY = -10.1 + 0.9 * load - lift;
  const drive = Math.cos((phase - 0.04) * TAU);
  const neckX = hipX + 7 + 1.2 * load;
  const neckY = hipY - 8.4;
  return pose({
    hx: hipX,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 0.7 + 0.5 * Math.cos((phase - 0.08) * TAU),
    fx: hipX - 4.5 - 1.2 * drive,
    fy: hipY - 3.2 + 0.8 * drive,
    sa: 2.78 + 0.12 * drive,
    bx: neckX + 0.5 + 7.2 * drive,
    by: neckY + 5 - 2 * drive,
    be: 0,
  });
}

export const zafirRunPose = fitRunFeet(dervishUpperBody);
