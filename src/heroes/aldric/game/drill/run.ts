import { STATE_CLIPS } from "../../../../constants/clips";
import type { Pose } from "../../../../types/pose";
import { TAU } from "../../../../utils/math";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { SHIELD_UP } from "../../constants/clips/key";

const RUN = STATE_CLIPS.run;

export function aldricRun(phase: number): Pose {
  const legs = sampleKeys(RUN.keys, (phase % 1) * RUN.dur);
  const sway = Math.sin(phase * TAU * 2);
  const hipY = legs.hy + 0.6;
  const neckX = legs.hx + 4.2;
  const neckY = hipY - 9.6;
  return {
    ...legs,
    ...SHIELD_UP,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 1.6,
    oa: 1.46 + 0.05 * sway,
    bx: neckX + 6.2,
    by: neckY + 6 + 0.6 * sway,
    fx: legs.hx - 3.5,
    fy: hipY - 3.2 - 0.8 * sway,
    sa: 2.45 + 0.08 * sway,
  };
}
