import { ACTION_CLIPS, STATE_CLIPS } from "../../constants/clips";
import type { ActiveWarp, DrillPoses } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { sampleKeys } from "../../utils/sampleKeys";

export function warpThrowPose(age: number): Pose {
  return sampleKeys(ACTION_CLIPS.throw.keys, age);
}

export function warpFlightPose(age: number): Pose {
  return sampleKeys(STATE_CLIPS.throwWait.keys, age);
}

export function warpArrivalPose(age: number): Pose {
  return sampleKeys(ACTION_CLIPS.warpStrike.keys, age);
}

export function warpPose({ phase, age }: ActiveWarp, poses: DrillPoses): Pose {
  if (phase === "throw") {
    return poses.warpThrow(age);
  }
  return phase === "flight" ? poses.warpFlight(age) : poses.warpArrival(age);
}
