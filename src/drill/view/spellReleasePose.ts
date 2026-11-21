import type { DrillProfile, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { drillBody } from "../body";
import { SPELL_RELEASE_RECOVERY } from "../constants";

export function spellReleasePose(profile: DrillProfile, h: Fighter): Pose {
  const { spell, stance } = drillBody(profile).poses;
  if (!h.spellRelease) {
    return stance;
  }
  return blendPose(spell, stance, smooth(0.57, 1, 1 - h.spellRelease.life / SPELL_RELEASE_RECOVERY));
}
