import { clipAt } from "../../motionClips";
import type { ActiveWarp, DrillClips } from "../../types/drill";
import type { Pose } from "../../types/pose";

export function warpPose({ phase, age }: ActiveWarp, clips: DrillClips): Pose {
  const clip = phase === "throw" ? clips.warpThrow : phase === "flight" ? clips.warpFlight : clips.warpArrival;
  return clipAt(clip, age);
}
