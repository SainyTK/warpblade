import { STATE_CLIPS } from "../../../constants/clips";
import { FIST_CLIPS, HAMMER_CLIP } from "../../../constants/clips/hulda/fists";
import { GRAPPLE_CLIPS, THROW_CLIPS } from "../../../constants/clips/hulda/grapple";
import { HULDA_CLIPS } from "../../../constants/clips/hulda/moves";
import { CHARGE_POSE, HOLD_POSE, HULDA_IDLE } from "../../../constants/clips/hulda/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { progress } from "../../state";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { motion } from "../kael/motion";
import { woundedIdle, woundWeight } from "../wound";
import { carry, holding } from "./carry";
import { currentBlow } from "./fists";
import { hulda } from "./memory";

/** walking with a foe in her hands strides on; standing, she holds it at her hands */
function holdPose(h: Hero): Pose {
  if (Math.abs(h.vx) < 5) return HOLD_POSE;
  const clip = STATE_CLIPS.walk;
  return holding(sampleKeys(clip.keys, h.runPhase * clip.dur));
}

/** her clip for a state: her own for her actions and her idle, Kael's shared ones with her fists up otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "fist":
      return sampleKeys(FIST_CLIPS[currentBlow()].keys, h.st);
    case "airFist":
      return sampleKeys(HAMMER_CLIP.keys, h.st);
    case "grab":
    case "crush":
    case "knee":
    case "skyfall":
      return sampleKeys(GRAPPLE_CLIPS[h.state].keys, h.st);
    case "hold":
      return holdPose(h);
    case "toss":
      return sampleKeys(THROW_CLIPS[hulda.throwKind].keys, h.st);
    case "rush":
    case "bellow":
    case "taunt":
      return sampleKeys(HULDA_CLIPS[h.state].keys, h.st);
    case "charge": {
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...CHARGE_POSE, nx: CHARGE_POSE.nx + tremble };
    }
    case "ultimate":
      return sampleKeys((progress.ultimate === "titanThrow" ? HULDA_CLIPS.titan : HULDA_CLIPS.quake).keys, h.st);
    case "idle": {
      const wounded = carry(sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur));
      return woundedIdle(sampleKeys(HULDA_IDLE.keys, h.st % HULDA_IDLE.dur), wounded, wound);
    }
    case "jump":
      return carry(sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)));
    case "hurt":
    case "dead":
      return clipPose(h, t);
    default:
      return carry(clipPose(h, t));
  }
}

/** a plate breaking shoves her torso back a pixel for a few frames, over whatever she is doing */
function flinch(p: Pose): Pose {
  if (hulda.flinch <= 0) return p;
  return { ...p, nx: p.nx - 1, cb: p.cb - 0.5 };
}

/**
 * Hulda's pose: her clips, Kael's motion layer for the jump's clock, the landings and the hand-overs between clips, and
 * the flinch of a plate breaking.
 */
export function huldaPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  const base = statePose(h, t, fresh, dt, woundWeight(t));
  watchHandover(h, t, restarted, landed ? 1 : undefined);
  const p = flinch(handOver(landingPose(h, base, t), t));
  m.last = p;
  return p;
}
