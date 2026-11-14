import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { KAEL_WOUNDED_IDLE } from "../constants/clips/wounded";
import { KAEL_GUARD_CLIP } from "../constants/guardClip";

/** the clip Kael's state plays, his idle sunk into the wounded stance as far as his HP calls for */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  if (h.state === "jump") return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
  if (h.state === "guard") return sampleKeys(KAEL_GUARD_CLIP.keys, h.st);
  if (h.state !== "idle") return clipPose(h, t);
  const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
  return woundedIdle(clipPose(h, t), wounded, woundWeight(t));
}

/** Kael's pose: his clips, carried through the motion layer every hero shares */
export const kaelPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose);
