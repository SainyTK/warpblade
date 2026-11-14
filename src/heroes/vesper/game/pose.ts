import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { IDLE_CLIP, SHORT_CARRY, VESPER_ACTION_CLIPS, VESPER_CROUCH, WOUNDED_CLIP } from "../constants/clips";
import { clipOf } from "./abilityClip";
import { vesper } from "./state";

const CLIPS = VESPER_ACTION_CLIPS;

/** a shared clip with her short blade carried reverse-gripped along the far forearm */
const carried = (p: Pose): Pose => ({ ...p, oa: SHORT_CARRY });

/** the clip her state plays: her own for her stance, guard, hurt, dodge, warp and abilities, the shared gait and air */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  switch (h.state) {
    case "idle":
      return woundedIdle(
        sampleKeys(IDLE_CLIP.keys, h.st % IDLE_CLIP.dur),
        sampleKeys(WOUNDED_CLIP.keys, h.st % WOUNDED_CLIP.dur),
        woundWeight(t),
      );
    case "jump":
      return carried(sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt)));
    case "guard":
      return sampleKeys(CLIPS.guard.keys, h.st);
    case "hurt":
      return sampleKeys(CLIPS.hurt.keys, h.st);
    case "dash":
      return sampleKeys(CLIPS.dodge.keys, h.st);
    case "throw":
      return sampleKeys(CLIPS.throw.keys, h.st);
    case "warpStrike":
      return sampleKeys(CLIPS.arrival.keys, h.st);
    case "ultimate":
      return sampleKeys(CLIPS.waltz.keys, h.st);
    case "weave":
      return sampleKeys(clipOf(vesper.casting, vesper.wide).keys, h.st);
    case "stitch":
      return sampleKeys(CLIPS.stitch.keys, h.st % CLIPS.stitch.dur);
    case "move":
      return clipPose(h, t);
    default:
      return carried(clipPose(h, t));
  }
}

/** Vesper's pose: her clips, carried through the motion layer every hero shares, with her own jump crouch */
export const vesperPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose, VESPER_CROUCH);
