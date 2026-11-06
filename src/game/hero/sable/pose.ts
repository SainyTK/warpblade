import { STATE_CLIPS } from "../../../constants/clips";
import { SABLE_CLIPS, SABLE_IDLE } from "../../../constants/clips/sable/moves";
import { shootClip } from "../../../constants/clips/sable/shoot";
import { AIM_STANCE, AIR_LEGS, hold } from "../../../constants/clips/sable/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { FREE_STATES } from "../actions";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { motion } from "../kael/motion";
import { woundedIdle, woundWeight } from "../wound";
import { carry, crank } from "./carry";
import { sable } from "./memory";

/** one shot clip for each aim, on the floor and in the air */
const SHOTS = {
  level: shootClip(AIM_STANCE.level),
  up: shootClip(AIM_STANCE.up),
  low: shootClip(AIM_STANCE.low),
  levelAir: shootClip(hold({ ...AIM_STANCE.level, ...AIR_LEGS, hy: -14.5 })),
  upAir: shootClip(hold({ ...AIM_STANCE.up, ...AIR_LEGS, hy: -14.5 })),
  lowAir: shootClip(AIM_STANCE.air),
} as const;

function shotClip(h: Hero): ActionClip {
  if (h.ground) return SHOTS[sable.aim];
  return SHOTS[`${sable.aim}Air`];
}

/** her clip for a state: her own for her actions and her idle, Kael's shared ones with her hands on the crossbow otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "shoot":
      return sampleKeys(shotClip(h).keys, h.st);
    case "kick":
      return sampleKeys((h.ground ? SABLE_CLIPS.kick : SABLE_CLIPS.airKick).keys, h.st);
    case "hop":
    case "slide":
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
  let base = statePose(h, t, fresh, dt, woundWeight(t));
  if (sable.reload && FREE_STATES.has(h.state)) base = crank(base, t);
  watchHandover(h, t, restarted, landed ? 1 : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
