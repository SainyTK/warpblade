import { ANIM_FPS } from "../../constants/hero";
import { clipAt, clipStart, clipThrough, loopPose } from "../../motionClips";
import type { DrillClips, DrillMotion, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { blendPose } from "../../utils/poseBlend";
import { airProgress, brakeSpan, dashSpan, kickSpan, landRecovery, landSpan } from "./clips";
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
  clips: DrillClips,
  numbers: DrillMotion,
  motion: Motion,
  age: number,
  stride: number,
  landForce: number,
): Pose {
  const stance = clipStart(clips.idle);
  switch (motion) {
    case "warp":
      return h.warp ? warpPose(h.warp, clips) : stance;
    case "skill":
      return skillPose(h.skillCast, clips, h.grounded);
    case "parry":
      return parryPose(h, clips);
    case "stun":
    case "guard":
      return guardPose(h, clips, age);
    case "run":
      return loopPose(clips.run, stride * clips.run.frames.length);
    case "brake":
      return clipThrough(clips.brake, age / brakeSpan());
    case "idle":
      return loopPose(clips.idle, age * ANIM_FPS);
    case "dash":
      return clipThrough(h.airDashActive ? clips.airDash : clips.dash, age / dashSpan(numbers));
    case "jump":
    case "fall": {
      const clip = h.jumpBoost ? clips.dashJump : clips.jump;
      return clipThrough(clip, airProgress(h.vy, numbers));
    }
    case "kick":
      return clipThrough(clips.kick, age / kickSpan(numbers));
    case "wall":
      return clipAt(clips.wall, age);
    case "land": {
      const soft = blendPose(clipStart(clips.land), stance, landRecovery(age, numbers.landing));
      return blendPose(soft, clipThrough(clips.land, age / landSpan(numbers)), landForce);
    }
    default:
      return stance;
  }
}
