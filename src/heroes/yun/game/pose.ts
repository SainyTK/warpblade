import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { YUN_ACTION_CLIPS, YUN_GUARD_CLIP, YUN_IDLE, YUN_WOUNDED_IDLE } from "../constants/clips";
import { yun } from "./state";

/** the cast clip of the ability under way, in its wide form when it was held */
const castClip = () => YUN_ACTION_CLIPS[`${yun.castAbility}${yun.castWide ? "Wide" : ""}` as const];

/** the clip Yun's state plays: his own idle (sunk into the wounded stance as far as his HP calls for), guard and casts,
 *  and the shared clips for the rest */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  if (h.state === "jump") return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
  if (h.state === "guard") return sampleKeys(YUN_GUARD_CLIP.keys, h.st);
  if (h.state === "cast") return sampleKeys(castClip().keys, h.st);
  if (h.state !== "idle") return clipPose(h, t);
  const calm = sampleKeys(YUN_IDLE.keys, h.st % YUN_IDLE.dur);
  const wounded = sampleKeys(YUN_WOUNDED_IDLE.keys, h.st % YUN_WOUNDED_IDLE.dur);
  return woundedIdle(calm, wounded, woundWeight(t));
}

/** Yun's pose: his clips through the motion layer every hero shares, with the tassel's swing in the blade state */
export function yunPose(h: Hero, t: number): Pose {
  const p = motionPose(h, t, statePose);
  return { ...p, bs: p.mr >= 0.5 ? -yun.tassel : yun.tassel };
}
