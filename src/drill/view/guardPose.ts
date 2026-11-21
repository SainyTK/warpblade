import { POSES } from "../../constants/hero";
import type { DrillPoses, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { DEFENSE } from "../constants";

export function parryPose(h: Fighter, poses: DrillPoses): Pose {
  const age = h.parryAge ?? 0;
  const ready = h.guardAge !== null ? guardPose(h, poses) : h.grounded ? poses.stance : POSES.fall;
  const flick = blendPose(poses.parryContact, poses.parryReturn, smooth(0, 0.045, age));
  const recovery = smooth(0.052, DEFENSE.parryPoseTime, age);
  const present = blendPose(flick, ready, recovery);
  return h.grounded ? present : { ...present, ffy: -5, bfy: -4 };
}

export function guardPose(h: Fighter, poses: DrillPoses): Pose {
  if (h.stun > 0) {
    return poses.stagger;
  }
  return h.grounded ? poses.guard : poses.airGuard;
}
