import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { lerp } from "../../../utils/math";
import { sampleKeys } from "../../../utils/sampleKeys";
import { FLURRY_CLIP, LINE_CLIP } from "../constants/clips/abilities";
import { AT_REST } from "../constants/clips/base";
import { CERISE_GUARD_CLIP } from "../constants/clips/guard";
import { CERISE_CROUCH, CERISE_IDLE, CERISE_WOUNDED } from "../constants/clips/rest";
import { RIPOSTE_CLIP } from "../constants/clips/riposte";
import { TEMPEST_CLIP } from "../constants/clips/tempest";
import { CERISE_ARRIVE, CERISE_THROW } from "../constants/clips/warp";

/** how much of the shared stride's arm swing her sword hand keeps: she carries the rapier steady, point low ahead */
const SWORD_SWING = { walk: 0.25, run: 0.35 } as const;
/** where she carries the rapier while she walks and runs */
const CARRY = { walk: { fx: 6.5, fy: -15, sa: 0.95 }, run: { fx: 7.5, fy: -16.5, sa: 0.55 } } as const;

/** the shared walk or run with her own carry: the rapier low and forward, swinging a little with the stride */
function stride(p: Pose, kind: "walk" | "run"): Pose {
  const carry = CARRY[kind];
  const k = SWORD_SWING[kind];
  return {
    ...p,
    fx: carry.fx + (p.fx - 6) * k,
    fy: carry.fy + (p.fy + 15) * k,
    sa: carry.sa,
    bx: lerp(p.bx, AT_REST.bx, 0.5),
  };
}

/** the clip her state plays: her own for her states, the guard, the warp, the rest and the stride */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  switch (h.state) {
    case "jump":
      return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
    case "guard":
      return sampleKeys(CERISE_GUARD_CLIP.keys, h.st);
    case "riposte":
      return sampleKeys(RIPOSTE_CLIP.keys, h.st);
    case "flurry":
      return sampleKeys(FLURRY_CLIP.keys, h.st);
    case "lineCast":
      return sampleKeys(LINE_CLIP.keys, h.st);
    case "tempest":
      return sampleKeys(TEMPEST_CLIP.keys, h.st);
    case "throw":
      return sampleKeys(CERISE_THROW.keys, h.st);
    case "warpStrike":
      return sampleKeys(CERISE_ARRIVE.keys, h.st);
    case "walk":
    case "run":
      return stride(clipPose(h, t), h.state);
    case "idle": {
      const rest = sampleKeys(CERISE_IDLE.keys, h.st % CERISE_IDLE.dur);
      const wounded = sampleKeys(CERISE_WOUNDED.keys, h.st % CERISE_WOUNDED.dur);
      return woundedIdle(rest, wounded, woundWeight(t));
    }
    default:
      return clipPose(h, t);
  }
}

/** Cerise's pose: her clips, carried through the motion layer every hero shares, with her own jump crouch */
export const cerisePose = (h: Hero, t: number): Pose => motionPose(h, t, statePose, CERISE_CROUCH);
