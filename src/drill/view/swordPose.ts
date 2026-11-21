import { DRILL_STANCE } from "../../constants/drillPose";
import type { DrillProfile, Swing } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { ease, smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";

export function swordPose(profile: DrillProfile, { kind, age }: Swing): Pose {
  const { hit, duration, poses } = profile.strikes[kind];
  const { ready, load, cut, finish, settle } = poses;
  const release = hit * 0.62;
  if (age < release) {
    return blendPose(ready, load, smooth(0, release, age));
  }
  if (age < hit) {
    return blendPose(load, cut, smooth(release, hit, age));
  }
  const recovery = (age - hit) / (duration - hit);
  if (recovery < 0.1) {
    return cut;
  }
  if (recovery < settle) {
    return blendPose(cut, finish, smooth(0.1, 0.37, recovery));
  }
  const rest = kind === "air" ? ready : DRILL_STANCE;
  return blendPose(finish, rest, ease.outCubic(smooth(settle, 1, recovery)));
}
