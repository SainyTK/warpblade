import { STATE_CLIPS } from "../../../constants/clips";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero, HeroState } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { BLADE_STATE } from "../constants/blade";
import { SAYA_GUARD_CLIP } from "../constants/clips/guard";
import { SAYA_CROUCH, SAYA_IDLE, SAYA_WOUNDED_IDLE } from "../constants/clips/idle";
import { KIT_CLIPS } from "../constants/clips/kit";
import { SAYA_POSES } from "../constants/clips/poses";
import { saya } from "./state";

/** the shared clips that carry a sword in the hand, which she plays with the katana sheathed */
const SHEATHED: ReadonlySet<HeroState> = new Set(["walk", "run", "fall", "dash", "hurt", "dead"]);

/** the clip of each of her own states, and of the shared states she keys herself */
function ownClip(h: Hero): ActionClip | null {
  switch (h.state) {
    case "counter":
      return KIT_CLIPS.counter;
    case "warpStrike":
      return KIT_CLIPS.warpArrive;
    case "line":
      return saya.wide ? KIT_CLIPS.lineWide : KIT_CLIPS.line;
    case "rise":
      return saya.wide ? KIT_CLIPS.riseWide : KIT_CLIPS.rise;
    case "moon":
      return KIT_CLIPS.moon;
    default:
      return null;
  }
}

/** at rest: between blows of an open string she holds the drawn blade ready; otherwise she breathes with it sheathed,
 *  sinking into the wounded stance as far as her HP calls for */
function restPose(h: Hero, t: number): Pose {
  if (h.chain > 0 && h.link > 0) return SAYA_POSES.ready;
  const calm = sampleKeys(SAYA_IDLE.keys, h.st % SAYA_IDLE.dur);
  const wounded = sampleKeys(SAYA_WOUNDED_IDLE.keys, h.st % SAYA_WOUNDED_IDLE.dur);
  return woundedIdle(calm, wounded, woundWeight(t));
}

/** the clip Saya's state plays at this moment */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  const own = ownClip(h);
  if (own) return sampleKeys(own.keys, h.st);
  if (h.state === "idle") return restPose(h, t);
  if (h.state === "guard") return sampleKeys(SAYA_GUARD_CLIP.keys, h.st);
  if (h.state === "charge") {
    const p = sampleKeys(KIT_CLIPS.charge.keys, h.st % KIT_CLIPS.charge.dur);
    return h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? { ...p, nx: p.nx + 0.5 } : p;
  }
  if (h.state === "jump")
    return { ...sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt)), bs: BLADE_STATE.sheathed };
  const p = clipPose(h, t);
  return SHEATHED.has(h.state) ? { ...p, bs: BLADE_STATE.sheathed } : p;
}

/** Saya's pose: her clips, carried through the motion layer every hero shares */
export const sayaPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose, SAYA_CROUCH);
