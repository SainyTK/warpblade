import type { DrillPoses, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { clamp, ease, smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { guardPose, parryPose } from "./guardPose";
import { skillPose } from "./skillPose";
import { warpPose } from "./warpPose";

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

export function locomotionPose(
  h: Fighter,
  poses: DrillPoses,
  rise: number,
  motion: Motion,
  age: number,
  stride: number,
  landForce: number,
): Pose {
  switch (motion) {
    case "warp":
      return h.warp ? warpPose(h.warp) : poses.stance;
    case "skill":
      return skillPose(h.skillCast, poses, h.grounded);
    case "parry":
      return parryPose(h, poses);
    case "stun":
    case "guard":
      return guardPose(h, poses);
    case "run":
      return poses.run(stride);
    case "brake":
      return blendPose(poses.brake, poses.stance, smooth(0.025, BRAKING_TIME, age));
    case "idle":
      return blendPose(poses.stance, poses.breathe, (1 - Math.cos(age * 4.6)) * 0.5);
    case "dash":
      return h.airDashActive ? poses.airDash : poses.dash;
    case "jump":
      return blendPose(h.jumpBoost ? poses.leap : poses.rise, poses.fall, clamp(1 + h.vy / rise) ** 2 * 0.62);
    case "fall":
      return blendPose(h.jumpBoost ? poses.leap : poses.rise, poses.fall, 0.62 + 0.38 * smooth(0, rise * 0.6, h.vy));
    case "kick":
      return poses.kick;
    case "wall":
      return poses.wall;
    case "land": {
      const compression = blendPose(poses.touchdown, poses.low, landForce * smooth(0, 0.038, age));
      return blendPose(compression, poses.stance, ease.outCubic(smooth(0.038, LANDING_TIME, age)));
    }
    default:
      return poses.stance;
  }
}

export const BRAKING_TIME = 0.104;
export const LANDING_TIME = 0.118;
