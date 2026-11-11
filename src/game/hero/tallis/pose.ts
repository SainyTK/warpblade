import { STATE_CLIPS } from "../../../constants/clips";
import { KNIFE_CLIPS } from "../../../constants/clips/tallis/knives";
import {
  GLOAM_CROUCH,
  GLOAM_SLASH,
  KNOT_CLIP,
  SINK_POUR,
  SINK_RISE,
  SPELL_CLIP,
} from "../../../constants/clips/tallis/moves";
import { CHARGE_POSE, REVERSE, TALLIS_IDLE, VEIL_DIP } from "../../../constants/clips/tallis/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { LANDING } from "../../../constants/kael/motion";
import { GLOAMING } from "../../../constants/tallis/special";
import { VEIL } from "../../../constants/tallis/veil";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose, PoseKey } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { travelPose, watchTravel } from "../kael/travel";
import { woundedIdle, woundWeight } from "../wound";
import { tallis } from "./memory";

/**
 * The shared walk, run, jump, fall, flinch and wounded clips swing Kael's sword wide; Tallis keeps both knives close in
 * reverse grip through them, blades down along his forearms, so they never cut through his body.
 */
function held(h: Hero, p: Pose): Pose {
  if (h.state === "dead") return p;
  return { ...p, sa: REVERSE + (p.fx - 6) * 0.04 };
}

/** a clip at its time, held on its last key */
const play = (h: Hero, clip: ActionClip): Pose => sampleKeys(clip.keys, Math.min(h.st, clip.dur));

/** his clip for a state: his own for his actions and his idle, the shared ones otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "knife":
      return sampleKeys(KNIFE_CLIPS[tallis.current].keys, h.st);
    case "dropStab":
      return play(h, KNIFE_CLIPS.dropStab);
    case "risingCut":
      return play(h, KNIFE_CLIPS.risingCut);
    case "hamstring":
      return play(h, KNIFE_CLIPS.hamstring);
    case "sink":
      return sampleKeys(SINK_POUR.keys, Math.min(tallis.sinkT, SINK_POUR.dur));
    case "rise":
      return play(h, SINK_RISE);
    case "knotCast":
      return play(h, KNOT_CLIP);
    case "spellCast":
      return play(h, SPELL_CLIP);
    case "charge":
      return CHARGE_POSE;
    case "gloaming":
    case "eclipse":
      return h.st < GLOAMING.windup ? GLOAM_CROUCH : GLOAM_SLASH;
    case "idle": {
      const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
      const idle = woundedIdle(sampleKeys(TALLIS_IDLE.keys, h.st % TALLIS_IDLE.dur), wounded, wound);
      return wound > 0 ? held(h, idle) : idle;
    }
    case "jump":
      return held(h, sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)));
    default:
      return held(h, clipPose(h, t));
  }
}

/** how deep the hood's dip is now: it rises and settles over the flicker as the Veil comes on or ends */
function veilDip(): number {
  const since = tallis.veil ? tallis.veilT : VEIL.lock - tallis.veilLock;
  if (since < 0 || since >= VEIL.flicker) return 0;
  return Math.sin((since / VEIL.flicker) * Math.PI);
}

/** the dip laid over a free pose */
function dipped(h: Hero, p: Pose): Pose {
  const k = veilDip();
  if (!k || (h.state !== "idle" && h.state !== "walk" && h.state !== "run")) return p;
  const out = { ...p };
  for (const [key, d] of Object.entries(VEIL_DIP) as [PoseKey, number][]) out[key] += d * k;
  return out;
}

/**
 * Tallis's pose: his clips, the hood's dip as the Veil comes and goes, and Kael's motion layer for the jump's clock,
 * the landings and the hand-overs between clips.
 */
export function tallisPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  const base = loadPose(travelPose(h, dipped(h, statePose(h, t, fresh, dt, woundWeight(t))), t));
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
