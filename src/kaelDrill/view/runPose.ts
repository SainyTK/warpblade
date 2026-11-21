import { pose } from "../../constants/hero";
import { clamp, lerp, smooth, TAU } from "../../utils/math";
import { fitRunFeet, RUN_TOE_OFF } from "./runFoot";
import { cyclePhase } from "./runTrace";

export { RUN_STRIDE } from "./runFoot";
export const RUN_PUSH_PHASE = 0.2;

function swordCarry(phase: number) {
  const u = cyclePhase(phase);
  return 1 - smooth(0.12, 0.5, u) + smooth(0.76, 0.99, u);
}

function runUpperBody(phase: number) {
  const step = cyclePhase(phase * 2) / 2;
  const load = Math.sin(Math.PI * clamp(step / RUN_TOE_OFF)) ** 1.2;
  const flight = clamp((step - RUN_TOE_OFF) / (0.5 - RUN_TOE_OFF));
  const lift = 0.6 * 4 * flight * (1 - flight);
  const hipX = -0.6 + 0.35 * Math.sin(phase * TAU);
  const push = smooth(0.17, RUN_TOE_OFF, step) * (1 - smooth(RUN_TOE_OFF, 0.5, step));
  const hipY = -10.3 + 0.95 * load - 0.55 * push - lift;
  const drive = Math.cos((phase - 0.035) * TAU);
  const carry = swordCarry(phase);
  const neckX = hipX + 6.1 + 1.4 * load;
  const neckY = hipY - 8.7;
  return pose({
    hx: hipX,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 0.52 + 0.67 * Math.cos((phase - 0.085) * TAU),
    fx: hipX - lerp(3.8, 5.8, carry),
    fy: hipY - lerp(4.7, 7.4, carry),
    bx: neckX - 0.1 + 7.9 * drive,
    by: neckY + 4.65 - 1.6 * drive,
    sa: lerp(2.34, 3.23, carry),
  });
}

export const runPose = fitRunFeet(runUpperBody);
