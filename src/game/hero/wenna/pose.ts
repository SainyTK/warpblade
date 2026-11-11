import { LAMP_CLIPS } from "../../../constants/clips/wenna/lamp";
import {
  airborne,
  BECKON_CLIP,
  GREAT_CLIP,
  KINDLE_CLIP,
  LIGHT_CLIP,
  SPELL_CLIP,
  THOUSAND_CLIP,
} from "../../../constants/clips/wenna/moves";
import { CHARGE_POSE, WENNA_IDLE } from "../../../constants/clips/wenna/stance";
import { SWAP_CLIP, WENNA_JUMP } from "../../../constants/clips/wenna/travel";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { motion } from "../kael/motion";
import { woundedIdle, woundWeight } from "../wound";
import { wenna } from "./memory";

/** the pole carried upright in the shared clips, tipped a touch forward like her stance */
const CARRY = -1.35;
/** how far the pole's top follows the hand's swing in the shared clips, radians a pixel */
const CARRY_SWAY = 0.03;
/** the highest the hand may sit, so the pole's foot clears the floor while it is carried upright */
const CARRY_HAND = -13.5;
/** lying down, the hand keeps the pole this high so its hook stays above the floor */
const DOWN_HAND = -4;

/**
 * The shared walk, jump, fall, flinch and wounded clips swing Kael's sword low; her pole is long enough that the same
 * angle would sink the lantern into the floor, so she carries it upright like her stance, and a fall lays it flat.
 */
function carried(h: Hero, p: Pose): Pose {
  if (h.state === "dead") return { ...p, sa: p.mr >= 0.5 ? Math.PI : 0, fy: Math.min(p.fy, DOWN_HAND) };
  return { ...p, sa: CARRY + (p.fx - 6) * CARRY_SWAY, fy: Math.min(p.fy, CARRY_HAND) };
}

/** a clip at its time, legs together when she is in the air */
function play(h: Hero, clip: ActionClip): Pose {
  const p = sampleKeys(clip.keys, Math.min(h.st, clip.dur));
  return h.ground ? p : airborne(p);
}

/** her clip for a state: her own for her actions and her idle, the shared ones carrying the pole upright otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "lamp":
    case "lampDrop": {
      const clip = LAMP_CLIPS[wenna.current];
      return sampleKeys(clip.keys, Math.min(h.st, clip.dur));
    }
    case "lightCast":
      return play(h, LIGHT_CLIP);
    case "swap":
      return play(h, SWAP_CLIP);
    case "kindleCast":
      return play(h, KINDLE_CLIP);
    case "beckonCast":
      return play(h, BECKON_CLIP);
    case "spellCast":
      return play(h, SPELL_CLIP);
    case "greatWick":
      return play(h, GREAT_CLIP);
    case "thousand":
      return play(h, THOUSAND_CLIP);
    case "charge":
      return CHARGE_POSE;
    case "idle": {
      const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
      const idle = woundedIdle(sampleKeys(WENNA_IDLE.keys, h.st % WENNA_IDLE.dur), wounded, wound);
      return wound > 0 ? carried(h, idle) : idle;
    }
    case "jump":
      return carried(h, sampleKeys(WENNA_JUMP.keys, jumpClock(h, fresh, dt)));
    default:
      return carried(h, clipPose(h, t));
  }
}

/**
 * Wenna's pose: her clips, and Kael's motion layer for the jump's clock, the landings and the hand-overs between clips.
 * Her walk is the shared one, sampled by her kit's 20 px stride.
 */
export function wennaPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  const base = statePose(h, t, fresh, dt, woundWeight(t));
  watchHandover(h, t, restarted, landed ? 1 : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
