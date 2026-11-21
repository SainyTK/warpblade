import { DRILL_STANCE, frontHand, rearHand } from "../../constants/drillPose";
import { pose } from "../../constants/hero";
import type { DrillPoseId, DrillProfile } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { runPose } from "./runPose";

const BREATHE = { ...DRILL_STANCE, hy: -12.8, ny: -23, by: -15, fy: -15.8 };
const BRAKE = pose({
  hx: -4,
  hy: -10,
  nx: 0,
  ny: -20,
  fx: 9,
  fy: -15,
  ...rearHand(-7, -12),
  ffx: 10,
  bfx: -8,
  sa: 0.72,
});
const LOW = pose({ hx: -2, hy: -8, nx: 5, ny: -17, fx: 9, fy: -11, ...rearHand(-5, -12), ffx: 8, bfx: -8, sa: 0.74 });
const TOUCHDOWN = { ...LOW, hx: -3, hy: -12, nx: 2, ny: -22, fx: 10, fy: -16, fa: -0.26 };

const DASH = pose({
  hx: -4,
  hy: -8,
  nx: 8,
  ny: -13,
  cb: 0,
  fx: -12,
  fy: -10,
  ...frontHand(11, -8),
  ffx: 5,
  ffy: -1,
  fa: 0.55,
  bfx: -14,
  bfy: -2,
  ba: 0.85,
  sa: 3.15,
});
const AIR_DASH = { ...DASH, hy: -11, ny: -15, ffx: -4, ffy: -5, bfx: -16, bfy: -5, fa: 0.78, fy: -13 };
const RISE = pose({
  hy: -14,
  nx: 3,
  ny: -24,
  fx: 4,
  fy: -20,
  ...rearHand(-5, -16),
  ffx: 8,
  ffy: -8,
  bfx: -4,
  bfy: -1,
  ba: 0.7,
  sa: -0.44,
});
const LEAP = {
  ...RISE,
  hx: -3,
  hy: -12,
  nx: 7,
  ny: -21,
  fx: -8,
  fy: -14,
  ...frontHand(8, -18),
  ffx: 7,
  ffy: -8,
  bfx: -14,
  bfy: -2,
  sa: 3.18,
};
const KICK = { ...LEAP, bfx: -13, bfy: -8, ba: 1.1, ffy: -3, bx: 9, by: -23 };
const FALL = pose({
  hx: -1,
  hy: -14,
  nx: 2,
  ny: -24,
  ffx: 7,
  ffy: -1,
  bfx: -7,
  bfy: -4,
  fx: 9,
  fy: -18,
  ...rearHand(-6, -15),
  sa: 0.62,
  fa: 0.3,
  ba: 0.55,
});
const WALL = pose({
  hx: -4,
  hy: -12,
  nx: -1,
  ny: -22,
  fx: -9,
  fy: -15,
  bx: 6,
  by: -22,
  ffx: 6,
  ffy: -7,
  bfx: 4,
  bfy: -1,
  fa: -0.68,
  sa: 2.9,
});

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

const DEFAULT_POSES: Readonly<Record<DrillPoseId, Pose>> = {
  stance: DRILL_STANCE,
  breathe: BREATHE,
  brake: BRAKE,
  low: LOW,
  touchdown: TOUCHDOWN,
  dash: DASH,
  airDash: AIR_DASH,
  rise: RISE,
  leap: LEAP,
  kick: KICK,
  fall: FALL,
  wall: WALL,
  spell: SPELL,
};

export interface DrillPoses {
  poses: Readonly<Record<DrillPoseId, Pose>>;
  run(stride: number): Pose;
}

const resolved = new WeakMap<DrillProfile, DrillPoses>();

export function drillPoses(profile: DrillProfile): DrillPoses {
  const known = resolved.get(profile);
  if (known) {
    return known;
  }
  const poses = {
    poses: { ...DEFAULT_POSES, ...profile.locomotion?.poses },
    run: profile.locomotion?.run ?? runPose,
  };
  resolved.set(profile, poses);
  return poses;
}
