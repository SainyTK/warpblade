import { CLIPS, STATE_CLIPS } from "../../../constants/clips";
import { SABLE_GUARD_CLIP } from "../../../constants/clips/sable/guard";
import { SABLE_CLIPS, SABLE_IDLE } from "../../../constants/clips/sable/moves";
import { type StringClips, stringClips } from "../../../constants/clips/sable/shoot";
import { AIM_STANCE, AIR_LEGS, hold } from "../../../constants/clips/sable/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { GUARD_TIMES } from "../../../constants/combat";
import { LANDING } from "../../../constants/kael/motion";
import { BEATS } from "../../../constants/sable/bolt";
import { POINT_BLANK } from "../../../constants/sable/guard";
import { SLIDE } from "../../../constants/sable/moves";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { FREE_STATES } from "../actions";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { travelPose, watchTravel } from "../kael/travel";
import { woundedIdle, woundWeight } from "../wound";
import { carry, crank } from "./carry";
import { slideEnd } from "./evade";
import { bowString, sable } from "./memory";

/** the string's clips for each aim, on the floor and in the air */
const SHOTS = {
  level: stringClips(AIM_STANCE.level),
  up: stringClips(AIM_STANCE.up),
  low: stringClips(AIM_STANCE.low),
  levelAir: stringClips(hold({ ...AIM_STANCE.level, ...AIR_LEGS, hy: -14.5 })),
  upAir: stringClips(hold({ ...AIM_STANCE.up, ...AIR_LEGS, hy: -14.5 })),
  lowAir: stringClips(AIM_STANCE.air),
} as const;

/** the string at her aim, on the floor or in the air */
const shots = (h: Hero): StringClips => (h.ground ? SHOTS[sable.aim] : SHOTS[`${sable.aim}Air`]);

/** the beat under way, or the cock after the closing bolt once its clip has run */
function shotPose(h: Hero): Pose {
  const clips = shots(h);
  if (sable.cock > 0) return sampleKeys(clips.cock.keys, clips.cock.dur - sable.cock);
  return sampleKeys(clips.beats[bowString.beat].keys, h.st);
}

/** the closing beat, for the warp's heavy bolt */
const CLOSING = BEATS.length - 1;

/** the guard: her own clip, and in the parry's segment Point-Blank's kick from its hit frame on */
function guardPose(h: Hero): Pose {
  if (h.st < GUARD_TIMES.parry) return sampleKeys(SABLE_GUARD_CLIP.keys, h.st);
  const kick = h.ground ? SABLE_CLIPS.kick : SABLE_CLIPS.airKick;
  const share = (h.st - GUARD_TIMES.parry) / (GUARD_TIMES.parryEnd - GUARD_TIMES.parry);
  return sampleKeys(kick.keys, POINT_BLANK.hit + share * (kick.dur - POINT_BLANK.hit));
}

/** the warp: the grapple bolt loosed as the string's first beat, held aimed while it flies, and on arrival the closing
 *  beat from its release, for the heavy bolt */
function warpPose(h: Hero): Pose {
  const clips = h.ground ? SHOTS.level : SHOTS.levelAir;
  const first = clips.beats[0];
  if (h.state === "throw") return sampleKeys(first.keys, (h.st / CLIPS.throw.hit) * BEATS[0].fire);
  if (h.state === "throwWait")
    return sampleKeys(first.keys, BEATS[0].fire + Math.min(h.st, BEATS[0].dur - BEATS[0].fire));
  return sampleKeys(clips.beats[CLOSING].keys, BEATS[CLOSING].fire + h.st);
}

/** the slide clip's time: it holds the glide's last key while a longer glide (Slide Kick) runs, then rises */
function slideTime(st: number): number {
  const glide = SLIDE.load + SLIDE.time;
  const extra = slideEnd() - glide;
  if (st < glide) return st;
  return st < glide + extra ? glide : st - extra;
}

/** her clip for a state: her own for her actions and her idle, Kael's shared ones with her hands on the crossbow otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "shoot":
      return shotPose(h);
    case "guard":
      return guardPose(h);
    case "throw":
    case "throwWait":
    case "warpStrike":
      return warpPose(h);
    case "slide":
      return sampleKeys(SABLE_CLIPS.slide.keys, slideTime(h.st));
    case "hop":
    case "snare":
      return sampleKeys(SABLE_CLIPS[h.state].keys, h.st);
    case "idle": {
      const wounded = carry(sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur), "walk");
      return woundedIdle(sampleKeys(SABLE_IDLE.keys, h.st % SABLE_IDLE.dur), wounded, wound);
    }
    case "jump":
      return carry(sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)), "jump");
    default:
      return carry(clipPose(h, t), h.state);
  }
}

/**
 * Sable's pose: her clips, Kael's motion layer for the jump's clock, the landings and the hand-overs between clips, and
 * the crank turning under the crossbow while she reloads on the move.
 */
export function sablePose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  let base = loadPose(travelPose(h, statePose(h, t, fresh, dt, woundWeight(t)), t));
  if (sable.reload && FREE_STATES.has(h.state)) base = crank(base, t);
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
