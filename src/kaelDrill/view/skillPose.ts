import { POSES, pose } from "../../constants/hero";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import type { SkillCast } from "../simulation";
import { frontHand } from "./leftArm";

const CUT = pose({ hx: 3, hy: -11, nx: 8, ny: -20, fx: 15, fy: -15, ...frontHand(1, -17), ffx: 10, bfx: -8, sa: 0.32 });

export function skillPose(cast: SkillCast | null, stance: Pose, grounded: boolean): Pose {
  if (!cast) {
    return stance;
  }
  const { age, tier } = cast;
  const raised = blendPose(stance, POSES.release, smooth(0, tier.intro * 0.78, age));
  const casting =
    tier.kind === "nova"
      ? blendPose(raised, stance, smooth(tier.intro + 0.18, tier.duration, age))
      : age < tier.intro
        ? raised
        : blendPose(CUT, stance, smooth(tier.intro + 0.2, tier.duration, age));
  return grounded ? casting : { ...casting, ffy: -5, bfy: -8, fa: 0.34, ba: 0.5 };
}
