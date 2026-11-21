import { DRILL_STANCE, frontHand } from "../../constants/drillPose";
import { pose } from "../../constants/hero";
import type { Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { SPELL_RELEASE_RECOVERY } from "../constants";

const SPELL = pose({
  hx: -2,
  hy: -12,
  nx: 2,
  ny: -22,
  fx: -5,
  fy: -14,
  ...frontHand(15, -20),
  ffx: 7,
  bfx: -7,
  sa: 2.62,
});

export function spellReleasePose(h: Fighter): Pose {
  if (!h.spellRelease) {
    return DRILL_STANCE;
  }
  return blendPose(SPELL, DRILL_STANCE, smooth(0.57, 1, 1 - h.spellRelease.life / SPELL_RELEASE_RECOVERY));
}
