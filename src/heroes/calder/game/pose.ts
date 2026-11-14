import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { RECOIL_TIME } from "../constants/chamber";
import { CALDER_ACTION_CLIPS } from "../constants/clips";
import { CALDER_GUARD_CLIP } from "../constants/clips/guard";
import { CALDER_CROUCH, CALDER_IDLE, CARRY } from "../constants/clips/idle";
import { BREAK_END, BREAK_LOOP, BREAK_START } from "../constants/clips/ultimate";
import { CALDER_WOUNDED_IDLE } from "../constants/clips/wounded";
import { BREAK_FIRST } from "../constants/ultimate";
import { calder } from "./state";
import { breakOver } from "./ultimate/cylinderBreak";

/** how far a round's recoil throws the sword hand back and up, and tips the muzzle */
const KICK = { back: 2.2, up: 1.2, tip: 0.35 } as const;

/** the hip height of the stand the carry is set against */
const STAND_HIP = -14;

/** the walk carries the sword on the shoulder: the hand rides the hips' bob */
function carried(p: Pose): Pose {
  return { ...p, fx: CARRY.fx + p.hx, fy: CARRY.fy + (p.hy - STAND_HIP), sa: CARRY.sa };
}

/** the shot under way: its own clip, by ability and form */
function shotPose(h: Hero): Pose {
  const a = calder.shotAbility;
  const name =
    a === "scatter"
      ? calder.shotWide
        ? "twinScatter"
        : "scatter"
      : a === "slug" && calder.shotWide
        ? "breakerSlug"
        : "slug";
  return sampleKeys(CALDER_ACTION_CLIPS[name].keys, h.st);
}

/** Cylinder Break: the wind-up, the looped pair of cuts while the rounds last, then the recovery */
function breakPose(h: Hero): Pose {
  if (h.st < BREAK_FIRST) return sampleKeys(BREAK_START.keys, h.st);
  const over = breakOver();
  if (h.st < over) return sampleKeys(BREAK_LOOP.keys, (h.st - BREAK_FIRST) % BREAK_LOOP.dur);
  return sampleKeys(BREAK_END.keys, h.st - over);
}

/** the clip Calder's state plays; his idle sinks into the wounded stance as far as his HP calls for */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  switch (h.state) {
    case "jump":
      return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
    case "guard":
      return sampleKeys(CALDER_GUARD_CLIP.keys, h.st);
    case "walk":
      return carried(clipPose(h, t));
    case "reload":
      return sampleKeys(CALDER_ACTION_CLIPS.reload.keys, h.st);
    case "shot":
      return shotPose(h);
    case "cylinderBreak":
      return breakPose(h);
    case "idle": {
      const idle = sampleKeys(CALDER_IDLE.keys, h.st % CALDER_IDLE.dur);
      const wounded = sampleKeys(CALDER_WOUNDED_IDLE.keys, h.st % CALDER_WOUNDED_IDLE.dur);
      return woundedIdle(idle, wounded, woundWeight(t));
    }
    default:
      return clipPose(h, t);
  }
}

/** a round just went off: the sword hand kicks back and up and the muzzle tips, easing out */
function withRecoil(p: Pose): Pose {
  if (calder.recoil <= 0) return p;
  const k = calder.recoil / RECOIL_TIME;
  return { ...p, fx: p.fx - KICK.back * k, fy: p.fy - KICK.up * k, sa: p.sa - KICK.tip * k };
}

/** Calder's pose: his clips, carried through the motion layer every hero shares, with the recoil of his rounds on top */
export const calderPose = (h: Hero, t: number): Pose => withRecoil(motionPose(h, t, statePose, CALDER_CROUCH));
