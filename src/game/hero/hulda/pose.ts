import { STATE_CLIPS } from "../../../constants/clips";
import { FIST_CLIPS, HAMMER_CLIP } from "../../../constants/clips/hulda/fists";
import { GRAPPLE_CLIPS, THROW_CLIPS } from "../../../constants/clips/hulda/grapple";
import { HULDA_CLIPS } from "../../../constants/clips/hulda/moves";
import { MOVESET_CLIPS } from "../../../constants/clips/hulda/moveset";
import { JUMP_CROUCH } from "../../../constants/clips/hulda/settle";
import { CHARGE_POSE, HOLD_POSE, HULDA_IDLE } from "../../../constants/clips/hulda/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { LANDING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { woundedIdle, woundWeight } from "../wound";
import { carry, holding } from "./carry";
import { currentBlow } from "./fists";
import { huldaLandingPose, watchHuldaLanding } from "./landing";
import { hulda } from "./memory";
import { rushClipTime } from "./rushClock";
import { settlePose, watchSettle } from "./settle";
import { spellPose } from "./spellPose";
import { swingClipTime } from "./swing";

/** walking with a foe in her hands strides on; standing, she holds it at her hands */
function holdPose(h: Hero): Pose {
  if (Math.abs(h.vx) < 5) return HOLD_POSE;
  const clip = STATE_CLIPS.walk;
  return holding(sampleKeys(clip.keys, h.runPhase * clip.dur));
}

/**
 * The Giant Swing's spin from the hips up; while Cyclone walks her, the legs stride the walk clip by the ground covered
 * so the feet hold the floor. A mirrored spin key mirrors the legs back, so they always stride the way she goes.
 */
function walkingSpin(h: Hero): Pose {
  const spin = sampleKeys(THROW_CLIPS.swing.keys, swingClipTime(h.st));
  if (Math.abs(h.vx) < 5 || !h.ground) return spin;
  const clip = STATE_CLIPS.walk;
  const walk = sampleKeys(clip.keys, h.runPhase * clip.dur);
  const side = spin.mr ? -1 : 1;
  return {
    ...spin,
    hy: walk.hy,
    ffx: walk.ffx * side,
    ffy: walk.ffy,
    fa: walk.fa,
    bfx: walk.bfx * side,
    bfy: walk.bfy,
    ba: walk.ba,
  };
}

/** her clip for a state: her own for her actions, the shared moves and her idle, Kael's shared ones with her fists up
 *  otherwise (the dodge among them) */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "fist":
      return sampleKeys(FIST_CLIPS[currentBlow()].keys, h.st);
    case "airFist":
      return sampleKeys(HAMMER_CLIP.keys, h.st);
    case "knee":
    case "skyfall":
      return sampleKeys(GRAPPLE_CLIPS[h.state].keys, h.st);
    case "hold":
      return holdPose(h);
    case "toss":
      if (hulda.throwKind === "swing") return walkingSpin(h);
      return sampleKeys(THROW_CLIPS[hulda.throwKind].keys, h.st);
    case "rush":
      return sampleKeys(HULDA_CLIPS.rush.keys, rushClipTime(h.st));
    case "bellow":
    case "taunt":
      return sampleKeys(HULDA_CLIPS[h.state].keys, h.st);
    case "chain":
    case "stomp":
    case "brace":
    case "ride":
      return spellPose(h);
    case "charge": {
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...CHARGE_POSE, nx: CHARGE_POSE.nx + tremble };
    }
    case "ultimate":
      return sampleKeys(HULDA_CLIPS.quake.keys, h.st);
    case "throw":
    case "warpStrike":
    case "guard":
      return sampleKeys(MOVESET_CLIPS[h.state].keys, h.st);
    case "throwWait":
      return sampleKeys(MOVESET_CLIPS.throwWait.keys, h.st % MOVESET_CLIPS.throwWait.dur);
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

/**
 * Hulda's pose: her clips, Kael's motion layer for the jump's clock and the hand-overs between clips, her own heavy
 * landings, and her recoveries: a walk loading and stopping, a turn, and a plate breaking.
 */
export function huldaPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchHuldaLanding(h, t);
  const base = loadPose(statePose(h, t, fresh, dt, woundWeight(t)), JUMP_CROUCH);
  watchSettle(h, t, m.clip, m.face);
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = settlePose(h, handOver(huldaLandingPose(h, base, t), t), t);
  m.last = p;
  return p;
}
