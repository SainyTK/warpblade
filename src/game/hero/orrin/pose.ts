import { STATE_CLIPS } from "../../../constants/clips";
import { CHAIN_CLIPS, HANGING_CLIP } from "../../../constants/clips/orrin/chain";
import {
  CLIMB_POSE,
  HOOK_CLIP,
  PIN_CLIP,
  ROLL_CLIP,
  TAKEOFF_CROUCH,
  WARP_KICK_CLIP,
  WHIRL_CLIP,
} from "../../../constants/clips/orrin/moves";
import { CHARGE_POSE, HANG, ORRIN_IDLE, TUCK } from "../../../constants/clips/orrin/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { LANDING } from "../../../constants/kael/motion";
import { CHAIN_BLOWS } from "../../../constants/orrin/string";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import type { Point } from "../../../types/world";
import { clamp } from "../../../utils/math";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { landingPose, watchLanding } from "../kael/landing";
import { loadPose } from "../kael/load";
import { motion } from "../kael/motion";
import { travelPose, watchTravel } from "../kael/travel";
import { woundedIdle, woundWeight } from "../wound";
import { orrin } from "./memory";
import { circleTurns } from "./string";

/** the shoulder the chain hand reaches from, local pixels */
const SHOULDER: Point = { x: 1, y: -22 };
const ARM = 10.5;

/**
 * Hanging under a point: the chain hand reaches straight at it, the body leans toward it, the legs trail behind the way
 * he travels, and at the bottom of a fast arc the knees tuck.
 */
function hangPose(h: Hero, at: Point): Pose {
  const dx = (at.x - h.x) * h.face;
  const dy = at.y - (h.y + SHOULDER.y);
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const lvx = h.vx * h.face;
  const speed = Math.hypot(h.vx, h.vy);
  const trail = clamp(-lvx / 60, -4, 4);
  const low = Math.abs(ux) < 0.35 && uy < -0.8 && speed > 120;
  const legs = low
    ? TUCK
    : { ffx: 2 + trail, ffy: -2 + Math.abs(trail) * 0.4, fa: 0.5, bfx: -2 + trail, bfy: -1, ba: 0.4 };
  return {
    ...HANG,
    nx: HANG.nx + ux * 2,
    hx: HANG.hx - ux * 0.5,
    fx: SHOULDER.x + ux * ARM,
    fy: SHOULDER.y + uy * ARM,
    sa: Math.atan2(uy, ux),
    bx: 6 + clamp(lvx / 80, -2, 2),
    by: -21,
    ...legs,
  };
}

/** Full Circle's clip time: its spin keys repeat once for each extra Iron Weight turn */
function circleTime(st: number): number {
  const b = CHAIN_BLOWS.circle;
  const span = b.hitEnd - b.hit;
  const extra = (circleTurns() - 1) * span;
  if (st < b.hit || extra <= 0) return st;
  if (st < b.hit + span + extra) return b.hit + ((st - b.hit) % span);
  return st - extra;
}

/**
 * The Hanging Arc over whatever he is doing in the air: the whole body curls and snaps open with it, and while the chain
 * holds him in a swing the legs keep trailing the way he travels.
 */
function withArc(h: Hero, p: Pose): Pose {
  if (orrin.arc < 0) return p;
  const a = sampleKeys(HANGING_CLIP.keys, orrin.arc);
  const upper = {
    ...p,
    fx: a.fx,
    fy: a.fy,
    fe: a.fe,
    be: a.be,
    sa: a.sa,
    bx: a.bx,
    by: a.by,
    nx: a.nx,
    ny: a.ny,
    cb: a.cb,
  };
  if (h.state === "swing") return upper;
  return { ...upper, hy: a.hy, ffx: a.ffx, ffy: a.ffy, fa: a.fa, bfx: a.bfx, bfy: a.bfy, ba: a.ba };
}

/** the flight after a release: one roll out of a fling, then the shared fall */
function flyPose(h: Hero): Pose {
  if (orrin.flung && h.st < ROLL_CLIP.dur) return sampleKeys(ROLL_CLIP.keys, h.st);
  const fall = STATE_CLIPS.fall;
  return sampleKeys(fall.keys, h.st % fall.dur);
}

/** the special: crouched under the opening tear, then hanging from it */
function ultPose(h: Hero): Pose {
  if (h.st < 0.2 || !orrin.ultAt) return CHARGE_POSE;
  if (h.ground) return CHARGE_POSE;
  return hangPose(h, orrin.ultAt);
}

/** his clip for a state: his own for his actions and his idle, the shared ones otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "lash": {
      const clip = CHAIN_CLIPS[orrin.current];
      return sampleKeys(clip.keys, orrin.current === "circle" ? circleTime(h.st) : h.st);
    }
    case "hookThrow": {
      const p = sampleKeys(HOOK_CLIP.keys, h.st);
      return h.ground ? p : { ...p, ...TUCK };
    }
    case "swing":
      return orrin.latchAt ? hangPose(h, orrin.latchAt) : HANG;
    case "climb":
      return CLIMB_POSE;
    case "fly":
      return flyPose(h);
    case "warpStrike":
      return sampleKeys(WARP_KICK_CLIP.keys, h.st);
    case "whirl":
      return sampleKeys(WHIRL_CLIP.keys, h.st);
    case "pin":
      return sampleKeys(PIN_CLIP.keys, h.st);
    case "pendulum":
      return ultPose(h);
    case "charge": {
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...CHARGE_POSE, nx: CHARGE_POSE.nx + tremble };
    }
    case "idle": {
      const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
      return woundedIdle(sampleKeys(ORRIN_IDLE.keys, h.st % ORRIN_IDLE.dur), wounded, wound);
    }
    case "jump":
      return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt));
    default:
      return clipPose(h, t);
  }
}

/**
 * Orrin's pose: his clips, the swing pose built from the chain and his speed, the Hanging Arc's arms over any air pose,
 * and Kael's motion layer for the jump's clock, the landings and the hand-overs between clips.
 */
export function orrinPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  const base = loadPose(travelPose(h, withArc(h, statePose(h, t, fresh, dt, woundWeight(t))), t), TAKEOFF_CROUCH);
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
