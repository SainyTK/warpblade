import { STATE_CLIPS } from "../../../constants/clips";
import { MALLET_CLIPS } from "../../../constants/clips/jory/mallets";
import {
  BOOM_CLIP,
  ROLL_FAR,
  ROLL_NEAR,
  ROLL_PLANT,
  SPELL_CLIP,
  STEADY_CLIP,
  THUNDER_CLIP,
} from "../../../constants/clips/jory/moves";
import { JORY_GUARD_CLIP, JORY_THROW, JORY_WARP_STRIKE } from "../../../constants/clips/jory/shared";
import { CHARGE_POSE, NOD, RIDE_DOWN, RIDE_UP } from "../../../constants/clips/jory/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { LANDING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose, PoseKey } from "../../../types/pose";
import { blendPose } from "../../../utils/poseBlend";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { travelPose, watchTravel } from "../kael/travel";
import { woundedIdle, woundWeight } from "../wound";
import { beatShare } from "./beat";
import { jory } from "./memory";

/** the mallet rises through this part of each beat and peaks at the end of it */
const RISE_FROM = 0.5;
const PEAK_AT = 0.94;
/** the nod after each beat lasts this share of it */
const NOD_FOR = 0.18;

/**
 * The shared walk, run, jump, fall, flinch and wounded clips swing Kael's sword wide; Jory keeps both mallets close,
 * heads up at his shoulders, and the drum at his hip, so nothing cuts through his body.
 */
function held(h: Hero, p: Pose): Pose {
  if (h.state === "dead") return { ...p, dr: 0 };
  return { ...p, sa: -1.2 + (p.fx - 6) * 0.05, dr: 0 };
}

/** a clip at its time, held on its last key */
const play = (h: Hero, clip: ActionClip): Pose => sampleKeys(clip.keys, Math.min(h.st, clip.dur));

/** how high the near mallet rides now: down just after the beat, rising through the second half, up just before it */
function rideHeight(): number {
  const u = beatShare();
  if (u < RISE_FROM) return 0;
  const k = Math.min(1, (u - RISE_FROM) / (PEAK_AT - RISE_FROM));
  return k * k * (3 - 2 * k);
}

/** how deep the nod is now: it drops on the beat and comes back over the start of the beat */
function nodDepth(): number {
  const u = beatShare();
  return u < NOD_FOR ? Math.sin((u / NOD_FOR) * Math.PI) : 0;
}

/** the nod laid over a pose: the head and shoulders drop with the beat */
function nodded(p: Pose): Pose {
  const k = nodDepth();
  if (!k) return p;
  const out = { ...p };
  for (const [key, d] of Object.entries(NOD) as [PoseKey, number][]) out[key] += d * k;
  return out;
}

/** his idle rides the beat: the near mallet rises to the beat and taps down on it, and his head nods */
const ridePose = (): Pose => nodded(blendPose(RIDE_DOWN, RIDE_UP, rideHeight()));

/** the Drumroll: planted, then a mallet down on each beat of the roll, alternating hands, rising back between them */
function rollPose(h: Hero): Pose {
  if (jory.rung === 0 && jory.rings > 0) return ROLL_PLANT;
  const strike = jory.rung % 2 === 1 ? ROLL_NEAR : ROLL_FAR;
  const since = jory.rung >= jory.rings ? h.st : 0;
  return since > 0.2 ? CHARGE_POSE : strike;
}

/** his clip for a state: his own for his actions and his idle, the shared ones otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "mallet":
      return sampleKeys(MALLET_CLIPS[jory.current].keys, h.st);
    case "downstroke":
      return play(h, MALLET_CLIPS.downstroke);
    case "boom":
      return play(h, BOOM_CLIP);
    case "guard":
      return sampleKeys(JORY_GUARD_CLIP.keys, h.st);
    case "throw":
      return play(h, JORY_THROW);
    case "warpStrike":
      return play(h, JORY_WARP_STRIKE);
    case "abilityCast":
      return play(h, jory.casting === "thunderSkin" ? THUNDER_CLIP : STEADY_CLIP);
    case "spellCast":
      return play(h, SPELL_CLIP);
    case "charge":
      return CHARGE_POSE;
    case "drumroll":
      return rollPose(h);
    case "idle": {
      const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
      const idle = woundedIdle(ridePose(), wounded, wound);
      return wound > 0 ? held(h, idle) : idle;
    }
    case "walk":
    case "run":
      return nodded(held(h, clipPose(h, t)));
    case "jump":
      return held(h, sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)));
    default:
      return held(h, clipPose(h, t));
  }
}

/**
 * Jory's pose: his clips, the beat ride in his idle and the nod in his walk, and Kael's motion layer for the jump's
 * clock, the landings and the hand-overs between clips.
 */
export function joryPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  const base = loadPose(travelPose(h, statePose(h, t, fresh, dt, woundWeight(t)), t));
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
