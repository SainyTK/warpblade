import { ACTION_CLIPS, STATE_CLIPS } from "../../constants/clips";
import type { Pose } from "../../types/pose";
import { sampleKeys } from "../../utils/sampleKeys";
import type { ActiveWarp } from "../simulation";

export function warpPose({ phase, age }: ActiveWarp): Pose {
  const clip =
    phase === "throw" ? ACTION_CLIPS.throw : phase === "flight" ? STATE_CLIPS.throwWait : ACTION_CLIPS.warpStrike;
  return sampleKeys(clip.keys, age);
}
