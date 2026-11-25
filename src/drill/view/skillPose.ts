import { clipAt, clipStart } from "../../motionClips";
import type { DrillClips, SkillCast } from "../../types/drill";
import type { Pose } from "../../types/pose";

export function skillPose(cast: SkillCast | null, clips: DrillClips, grounded: boolean): Pose {
  if (!cast) {
    return clipStart(clips.idle);
  }
  const casting = clipAt(clips.tiers[cast.tier.level - 1], cast.age);
  return grounded ? casting : { ...casting, ffy: -5, bfy: -8, fa: 0.34, ba: 0.5 };
}
