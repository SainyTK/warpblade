import { ANIM_FPS } from "../constants/hero";
import type { PoseClip } from "../types/motionClip";
import type { Pose } from "../types/pose";
import { blendPose } from "../utils/poseBlend";

function between({ frames, snaps }: PoseClip, index: number, next: number, u: number): Pose {
  const from = frames[index] as Pose;
  return u > 0 && !snaps.includes(next) ? blendPose(from, frames[next] as Pose, u) : from;
}

export function framePose(clip: PoseClip, position: number): Pose {
  const last = clip.frames.length - 1;
  const at = Math.min(Math.max(position, 0), last);
  const index = Math.floor(at);
  return between(clip, index, Math.min(index + 1, last), at - index);
}

export function loopPose(clip: PoseClip, position: number): Pose {
  const count = clip.frames.length;
  const at = ((position % count) + count) % count;
  const index = Math.floor(at);
  return between(clip, index, (index + 1) % count, at - index);
}

export const clipAt = (clip: PoseClip, age: number): Pose => framePose(clip, age * ANIM_FPS);

/** the clip spread over a span, from its first frame at progress 0 to its last at 1, so its frame count sets only its detail */
export const clipThrough = (clip: PoseClip, progress: number): Pose =>
  framePose(clip, progress * (clip.frames.length - 1));

export const clipStart = (clip: PoseClip): Pose => clip.frames[0] as Pose;
