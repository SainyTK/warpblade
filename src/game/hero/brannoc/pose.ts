import { STATE_CLIPS } from "../../../constants/clips";
import { AXE_CLIPS, REAP_TURN_KEYS } from "../../../constants/clips/brannoc/axe";
import { BRANNOC_GUARD_CLIP } from "../../../constants/clips/brannoc/guard";
import {
  CRESCENT_CLIP,
  CRY_CLIP,
  FRENZY_CLIP,
  LAST_CLEAVE_CLIP,
  ROAR_POSE,
  SPELL_CLIP,
} from "../../../constants/clips/brannoc/moves";
import { BLOODIED_IDLE, BRANNOC_IDLE, CHARGE_POSE } from "../../../constants/clips/brannoc/stance";
import { HUNT_THROW_CLIP, HUNT_WAIT_CLIP } from "../../../constants/clips/brannoc/warp";
import { LANDING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { travelPose, watchTravel } from "../kael/travel";
import { isBloodied } from "./fury";
import { brannoc } from "./memory";
import { reaping, reapShare } from "./string";

/** the near hand rests at the shoulder this far from the neck, the axe head up behind him */
const SHOULDER = { x: 2.6, y: 3.4, sa: -2.05 } as const;

/**
 * The shared walk, run, jump, fall and flinch clips swing Kael's sword wide; Brannoc carries the great axe on his near
 * shoulder, its head up behind him, so it never cuts through his body. The far arm keeps the clip's swing.
 */
function shouldered(h: Hero, p: Pose): Pose {
  if (h.state === "dead") return p;
  return { ...p, fx: p.nx + SHOULDER.x, fy: p.ny + SHOULDER.y, sa: SHOULDER.sa, fe: 0, ah: 0 };
}

/** a clip at its time, held on its last key */
const play = (h: Hero, clip: ActionClip): Pose => sampleKeys(clip.keys, Math.min(h.st, clip.dur));

/** the warp's arrival: the Hunt chop from the moment the axe is buried in the foe, ripped out and brought round */
const huntChop = (h: Hero): Pose => {
  const clip = AXE_CLIPS.huntChop;
  return sampleKeys(clip.keys, Math.min(h.st + clip.hit, clip.dur));
};

/** the axe blow under way: the Bloodied Cleave has its own clip, and Spinning Reap's turns loop the turn */
function axePose(h: Hero): Pose {
  if (reaping()) return sampleKeys(REAP_TURN_KEYS, reapShare());
  const blow = brannoc.current === "cleave" && brannoc.double ? "bloodiedCleave" : brannoc.current;
  return sampleKeys(AXE_CLIPS[blow].keys, h.st);
}

/** his clip for a state: his own for his actions and his idles, the shared ones otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number): Pose {
  switch (h.state) {
    case "axe":
      return axePose(h);
    case "hatchet":
      return play(h, AXE_CLIPS.hatchet);
    case "warpStrike":
      return huntChop(h);
    case "throw":
      return play(h, HUNT_THROW_CLIP);
    case "throwWait":
      return sampleKeys(HUNT_WAIT_CLIP.keys, h.st % HUNT_WAIT_CLIP.dur);
    case "guard":
      return sampleKeys(BRANNOC_GUARD_CLIP.keys, h.st);
    case "dash":
      return clipPose(h, t);
    case "frenzy":
      return play(h, FRENZY_CLIP);
    case "abilityCast":
      return play(h, brannoc.casting === "warCry" ? CRY_CLIP : CRESCENT_CLIP);
    case "spellCast":
      return play(h, SPELL_CLIP);
    case "charge":
      return CHARGE_POSE;
    case "roar":
      return ROAR_POSE;
    case "lastCleave":
      return play(h, LAST_CLEAVE_CLIP);
    case "idle": {
      // Bloodied, his own heaving idle with the axe dragging takes the place of the shared wounded idle
      const clip = isBloodied() ? BLOODIED_IDLE : BRANNOC_IDLE;
      return sampleKeys(clip.keys, h.st % clip.dur);
    }
    case "jump":
      return shouldered(h, sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)));
    default:
      return shouldered(h, clipPose(h, t));
  }
}

/**
 * Brannoc's pose: his clips, and Kael's motion layer for the jump's clock, the landings and the hand-overs between
 * clips.
 */
export function brannocPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  const base = loadPose(travelPose(h, statePose(h, t, fresh, dt), t));
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
