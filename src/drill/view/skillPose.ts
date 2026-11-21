import { POSES } from "../../constants/hero";
import type { DrillProfile, SkillCast } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { drillBody } from "../body";

export function skillPose(profile: DrillProfile, cast: SkillCast | null, grounded: boolean): Pose {
  const { stance, skillCut } = drillBody(profile).poses;
  if (!cast) {
    return stance;
  }
  const { age, tier } = cast;
  const raised = blendPose(stance, POSES.release, smooth(0, tier.intro * 0.78, age));
  const casting =
    tier.look === "nova"
      ? blendPose(raised, stance, smooth(tier.intro + 0.18, tier.duration, age))
      : age < tier.intro
        ? raised
        : blendPose(skillCut, stance, smooth(tier.intro + 0.2, tier.duration, age));
  return grounded ? casting : { ...casting, ffy: -5, bfy: -8, fa: 0.34, ba: 0.5 };
}
