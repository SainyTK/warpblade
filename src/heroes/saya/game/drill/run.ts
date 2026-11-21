import { drillRunPose } from "../../../../drill";
import type { Pose } from "../../../../types/pose";
import { BLADE_STATE } from "../../constants/blade";

export function sayaRun(phase: number): Pose {
  const stride = drillRunPose(phase);
  return {
    ...stride,
    nx: stride.nx + 1.8,
    ny: stride.ny + 0.8,
    cb: stride.cb + 0.5,
    fx: stride.hx + 7,
    fy: stride.hy - 3.6,
    sa: -2.6,
    bs: BLADE_STATE.sheathed,
  };
}
