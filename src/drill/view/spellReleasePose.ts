import type { DrillPoses, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { SPELL_RELEASE_RECOVERY } from "../constants";

export function spellReleasePose(h: Fighter, poses: DrillPoses): Pose {
  if (!h.spellRelease) {
    return poses.stance;
  }
  return blendPose(poses.spell, poses.stance, smooth(0.57, 1, 1 - h.spellRelease.life / SPELL_RELEASE_RECOVERY));
}
