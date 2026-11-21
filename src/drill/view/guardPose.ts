import { frontHand, rearHand } from "../../constants/drillPose";
import { POSES, pose } from "../../constants/hero";
import type { Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { DEFENSE } from "../constants";

const GUARD = pose({
  hx: -2,
  hy: -10,
  nx: 0,
  ny: -20,
  fx: 10,
  fy: -15,
  ...frontHand(6, -16),
  ffx: 9,
  bfx: -8,
  sa: -1.34,
});
const AIR_GUARD = { ...GUARD, ffy: -5, bfy: -4, fa: 0.23, ba: 0.55 };
const STAGGER = pose({
  hx: -5,
  hy: -11,
  nx: -8,
  ny: -20,
  fx: 5,
  fy: -13,
  ...rearHand(-10, -15),
  ffx: 7,
  bfx: -8,
  sa: 0.7,
});

const PARRY_CONTACT = pose({
  hx: -2,
  hy: -10,
  nx: 2,
  ny: -20,
  fx: 12,
  fy: -18,
  ...frontHand(7, -17),
  ffx: 9,
  bfx: -8,
  sa: -0.95,
});
const PARRY_RETURN = {
  ...PARRY_CONTACT,
  hx: 3,
  nx: 7,
  ny: -21,
  fx: 18,
  fy: -20,
  ...rearHand(-4, -14),
  bfx: -9,
  sa: -0.18,
};

export function parryPose(h: Fighter, stance: Pose): Pose {
  const age = h.parryAge ?? 0;
  const ready = h.guardAge !== null ? guardPose(h) : h.grounded ? stance : POSES.fall;
  const flick = blendPose(PARRY_CONTACT, PARRY_RETURN, smooth(0, 0.045, age));
  const recovery = smooth(0.052, DEFENSE.parryPoseTime, age);
  const present = blendPose(flick, ready, recovery);
  return h.grounded ? present : { ...present, ffy: -5, bfy: -4 };
}

export function guardPose(h: Fighter): Pose {
  if (h.stun > 0) {
    return STAGGER;
  }
  return h.grounded ? GUARD : AIR_GUARD;
}
