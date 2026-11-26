import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, POSES, pose } from "../../../../constants/hero";
import type { DrillPoses } from "../../../../types/drill";
import type { Pose } from "../../../../types/pose";
import { smooth } from "../../../../utils/math";
import { blendPose } from "../../../../utils/poseBlend";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { ARRIVAL, GUARD, THROW, ULTIMATE } from "../clips";

const THROWN = sampleKeys(THROW.keys, THROW.dur);
const WAITING = pose({ ...THROWN, hy: -13.2, cb: 0.3, nx: 3.5, ny: -23.2, fx: 11, fy: -19, sa: 0.2, by: -17 });
const GUARD_HOLD = sampleKeys(GUARD.keys, GUARD_TIMES.loopFrom);
const AIR_GUARD = { ...GUARD_HOLD, ffy: -5, bfy: -4, fa: 0.25, ba: 0.55 };
const PARRY_CONTACT = sampleKeys(GUARD.keys, GUARD_TIMES.parry + frame(2));
const PARRY_RETURN = sampleKeys(GUARD.keys, GUARD_TIMES.parry + frame(6));
const STAGGER = pose({
  hx: -4,
  hy: -12,
  cb: -1.4,
  nx: -6.5,
  ny: -21,
  fx: 4,
  fy: -12,
  sa: 1.4,
  bx: 0,
  by: -15,
  ffx: 6,
  bfx: -7,
  ba: 0.4,
});
const COIL = pose({ ...POSES.charge, cb: -0.6, hy: -11.5, ny: -21.5, fx: -3, fy: -17, sa: 2.7, bx: 5, by: -16 });
const SKYWARD = sampleKeys(ULTIMATE.keys, frame(3));

function warpFlight(age: number): Pose {
  const settled = blendPose(THROWN, WAITING, smooth(0, 0.3, age));
  return { ...settled, ny: settled.ny + 0.3 * Math.sin(age * 6) };
}

export const ZAFIR_COMBAT_POSES: Partial<DrillPoses> = {
  guard: GUARD_HOLD,
  airGuard: AIR_GUARD,
  parryContact: PARRY_CONTACT,
  parryReturn: PARRY_RETURN,
  stagger: STAGGER,
  skillWindup: COIL,
  skillCut: SKYWARD,
  warpThrow: (age) => sampleKeys(THROW.keys, age),
  warpFlight,
  warpArrival: (age) => sampleKeys(ARRIVAL.keys, age),
};
