import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { BRYNN_ABILITY_CLIPS } from "../constants/clips/abilities";
import { BRYNN_GUARD_CLIP } from "../constants/clips/guard";
import { BRYNN_HELD_CLIPS } from "../constants/clips/held";
import { BRYNN_LOCOMOTION } from "../constants/clips/locomotion";
import { BRYNN_WOUNDED_IDLE } from "../constants/clips/wounded";

/** her own clips for the states every hero has, played once from entering the state */
const ONCE: Readonly<Partial<Record<Hero["state"], ActionClip>>> = {
  fall: BRYNN_LOCOMOTION.fall,
  guard: BRYNN_GUARD_CLIP,
  hurt: BRYNN_HELD_CLIPS.hurt,
  dash: BRYNN_HELD_CLIPS.dash,
  throw: BRYNN_HELD_CLIPS.throw,
  warpStrike: BRYNN_HELD_CLIPS.warpStrike,
  ultimate: BRYNN_HELD_CLIPS.ultimate,
  rend: BRYNN_ABILITY_CLIPS.rend,
  quake: BRYNN_ABILITY_CLIPS.quake,
};
/** her own clips that repeat while she stays in the state */
const LOOPS: Readonly<Partial<Record<Hero["state"], ActionClip>>> = {
  throwWait: BRYNN_HELD_CLIPS.throwWait,
  charge: BRYNN_HELD_CLIPS.charge,
};

/** the clip Brynn's state plays: her own for every state she has one for, her idle sunk into the wounded stance as far
 *  as her HP calls for */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  if (h.state === "jump") return sampleKeys(BRYNN_LOCOMOTION.jump.keys, jumpClock(h, frame.fresh, frame.dt));
  if (h.state === "walk" || h.state === "run") {
    const clip = BRYNN_LOCOMOTION[h.state];
    return sampleKeys(clip.keys, h.runPhase * clip.dur);
  }
  const once = ONCE[h.state];
  if (once) return sampleKeys(once.keys, h.st);
  const loop = LOOPS[h.state];
  if (loop) return sampleKeys(loop.keys, h.st % loop.dur);
  if (h.state !== "idle") return clipPose(h, t);
  const idle = BRYNN_LOCOMOTION.idle;
  const wounded = sampleKeys(BRYNN_WOUNDED_IDLE.keys, h.st % BRYNN_WOUNDED_IDLE.dur);
  return woundedIdle(sampleKeys(idle.keys, h.st % idle.dur), wounded, woundWeight(t));
}

/** a jump from a stand sinks into her ready stance's knees first, the sword still on her shoulder */
const CROUCH = sampleKeys(BRYNN_LOCOMOTION.crouch.keys, 0);

/** Brynn's pose: her clips, carried through the motion layer every hero shares */
export const brynnPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose, CROUCH);
