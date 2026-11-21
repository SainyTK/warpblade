import { POSES } from "../../constants/hero";
import type { DrillPoses, SkillCast } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";

export function skillPose(cast: SkillCast | null, poses: DrillPoses, grounded: boolean): Pose {
  const { stance } = poses;
  if (!cast) {
    return stance;
  }
  const { age, tier } = cast;
  const cut = tier.pose ?? poses.skill;
  const raised = blendPose(stance, POSES.release, smooth(0, tier.intro * 0.78, age));
  const casting =
    tier.look === "nova" && !tier.pose
      ? blendPose(raised, stance, smooth(tier.intro + 0.18, tier.duration, age))
      : age < tier.intro
        ? raised
        : blendPose(cut, stance, smooth(tier.intro + 0.2, tier.duration, age));
  return grounded ? casting : { ...casting, ffy: -5, bfy: -8, fa: 0.34, ba: 0.5 };
}
