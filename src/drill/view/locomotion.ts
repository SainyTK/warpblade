import { DRILL_STANCE, frontHand, rearHand } from "../../constants/drillPose";
import { pose } from "../../constants/hero";
import type { Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { clamp, ease, smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { MOTION } from "../constants";
import { guardPose, parryPose } from "./guardPose";
import { runPose } from "./runPose";
import { skillPose } from "./skillPose";
import { warpPose } from "./warpPose";

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

export type Motion =
  | "idle"
  | "run"
  | "brake"
  | "jump"
  | "fall"
  | "dash"
  | "wall"
  | "kick"
  | "land"
  | "swing"
  | "guard"
  | "parry"
  | "stun"
  | "chain"
  | "skill"
  | "warp";

export function motionOf(h: Fighter, landing: number, braking: boolean): Motion {
  if (h.stun > 0) return "stun";
  if (h.skillCast) return "skill";
  if (h.warp) return "warp";
  if (h.parryAge !== null) return "parry";
  if (h.guardAge !== null) return "guard";
  if (h.spellRelease) return "chain";
  if (h.swing) return "swing";
  if (h.dashTime > 0) return "dash";
  if (h.wall) return "wall";
  if (h.wallLock > 0) return "kick";
  if (!h.grounded) return h.vy < 0 ? "jump" : "fall";
  if (landing > 0) return "land";
  if (braking) return "brake";
  if (Math.abs(h.vx) > 8) return "run";
  return "idle";
}

export function locomotionPose(h: Fighter, motion: Motion, age: number, stride: number, landForce: number): Pose {
  switch (motion) {
    case "warp":
      return h.warp ? warpPose(h.warp) : DRILL_STANCE;
    case "skill":
      return skillPose(h.skillCast, DRILL_STANCE, h.grounded);
    case "parry":
      return parryPose(h, DRILL_STANCE);
    case "stun":
    case "guard":
      return guardPose(h);
    case "run":
      return runPose(stride);
    case "brake":
      return blendPose(BRAKE, DRILL_STANCE, smooth(0.025, BRAKING_TIME, age));
    case "idle":
      return blendPose(DRILL_STANCE, BREATHE, (1 - Math.cos(age * 4.6)) * 0.5);
    case "dash":
      return h.airDashActive ? AIR_DASH : DASH;
    case "jump":
      return blendPose(h.jumpBoost ? LEAP : RISE, FALL, clamp(1 + h.vy / MOTION.rise) ** 2 * 0.62);
    case "fall":
      return blendPose(h.jumpBoost ? LEAP : RISE, FALL, 0.62 + 0.38 * smooth(0, MOTION.rise * 0.6, h.vy));
    case "kick":
      return KICK;
    case "wall":
      return WALL;
    case "land": {
      const compression = blendPose(TOUCHDOWN, LOW, landForce * smooth(0, 0.038, age));
      return blendPose(compression, DRILL_STANCE, ease.outCubic(smooth(0.038, LANDING_TIME, age)));
    }
    default:
      return DRILL_STANCE;
  }
}

export const BRAKING_TIME = 0.104;
export const LANDING_TIME = 0.118;
