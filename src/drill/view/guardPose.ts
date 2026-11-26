import { POSES } from "../../constants/hero";
import { clipAt, clipStart } from "../../motionClips";
import type { DrillClips, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { shiftPose } from "../../utils/poseBlend";
import { parryRecovery } from "./clips";

export function guardPose(h: Fighter, clips: DrillClips, age: number): Pose {
  if (h.stun > 0) {
    return clipAt(clips.stagger, age);
  }
  return clipAt(h.grounded ? clips.guard : clips.airGuard, age);
}

export function parryPose(h: Fighter, clips: DrillClips): Pose {
  const age = h.parryAge ?? 0;
  const ready = h.guardAge !== null ? guardPose(h, clips, h.guardAge) : h.grounded ? clipStart(clips.idle) : POSES.fall;
  const present = shiftPose(clipAt(clips.parry, age), clipStart(clips.guard), ready, parryRecovery(age));
  return h.grounded ? present : { ...present, ffy: -5, bfy: -4 };
}
