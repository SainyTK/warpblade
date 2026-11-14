import { STATE_CLIPS } from "../../../constants/clips";
import { STAND } from "../../../constants/hero";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { ARRIVAL, CAST_CLIPS, DODGE, GUARD, IDLE, THROW, ULTIMATE, WOUNDED_IDLE } from "../constants/clips";
import { zafir } from "./state";

/** the cast clip of the ability under way, at `st` seconds into it */
function castPose(st: number): Pose {
  const a = zafir.casting;
  const clip = a === "spout" ? CAST_CLIPS.spout : a === "crescent" ? CAST_CLIPS.toss : CAST_CLIPS.push;
  return sampleKeys(clip.keys, st);
}

/** his legs keep walking under a spin while he moves: the walk's feet under the spin's body */
function walkingLegs(h: Hero, p: Pose): Pose {
  if (!h.ground || Math.abs(h.vx) < 8) return p;
  const walk = sampleKeys(STATE_CLIPS.walk.keys, zafir.stride * STATE_CLIPS.walk.dur);
  return {
    ...p,
    ffx: walk.ffx,
    ffy: walk.ffy,
    fa: walk.fa,
    bfx: walk.bfx,
    bfy: walk.bfy,
    ba: walk.ba,
    hy: p.hy + (walk.hy - STAND.hy) * 0.6,
  };
}

/** the clip Zafir's state plays: his own rest, guard, dodge, warp, casts and ultimate; the shared clips otherwise */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  switch (h.state) {
    case "jump":
      return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
    case "guard":
      return sampleKeys(GUARD.keys, h.st);
    case "dash":
      return sampleKeys(DODGE.keys, h.st);
    case "throw":
      return sampleKeys(THROW.keys, h.st);
    case "warpStrike":
      return sampleKeys(ARRIVAL.keys, h.st);
    case "ultimate":
      return sampleKeys(ULTIMATE.keys, h.st);
    case "sandcast":
      return castPose(h.st);
    case "move":
      return walkingLegs(h, clipPose(h, t));
    case "idle": {
      const rest = sampleKeys(IDLE.keys, h.st % IDLE.dur);
      const wounded = sampleKeys(WOUNDED_IDLE.keys, h.st % WOUNDED_IDLE.dur);
      return woundedIdle(rest, wounded, woundWeight(t));
    }
    default:
      return clipPose(h, t);
  }
}

/** Zafir's pose: his clips, carried through the motion layer every hero shares */
export const zafirPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose);
