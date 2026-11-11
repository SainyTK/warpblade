import { STATE_CLIPS } from "../../../constants/clips";
import {
  airborne,
  CLOCK_CLIP,
  HAND_CLIP,
  HOUR_CLIP,
  NOON_CLIP,
  REWIND_CLIP,
  SPELL_CLIP,
  STILL_CAST,
} from "../../../constants/clips/mirel/moves";
import { MIREL_SETTLE } from "../../../constants/clips/mirel/settle";
import { STAFF_CLIPS } from "../../../constants/clips/mirel/staff";
import { CHARGE_POSE, HOVER_POSE, MIREL_IDLE } from "../../../constants/clips/mirel/stance";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import { REWIND } from "../../../constants/mirel/rewind";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { progress } from "../../state";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "../kael/handover";
import { jumpClock } from "../kael/jumpClock";
import { watchLanding } from "../kael/landing";
import { motion } from "../kael/motion";
import { woundedIdle, woundWeight } from "../wound";
import { takeoffTime } from "./jump";
import { mirelLanding, settleRewind } from "./landing";
import { mirel } from "./memory";

/** frames the hover crosses in over from the fall pose, and back out */
const HOVER_FRAMES = 2;

/** whether the last pose shown was the hover, so its start and end cross over */
const shown = { hover: false };
rememberPerSeat(objectMemory(shown, true));

/** the staff carried upright in the shared clips, its top swaying a little with the hand */
const CARRY = -1.45;
/** the highest the hand may sit, so the staff's foot clears the floor while it is carried upright */
const CARRY_HAND = -13.5;

/**
 * The shared walk, run, jump, fall, flinch and wounded clips swing Kael's sword low; her staff is long enough that the
 * same angle would sink its ring into the floor, so she carries it upright like her stance, and a fall lays it flat.
 */
function carried(h: Hero, p: Pose): Pose {
  if (h.state === "dead") return { ...p, sa: p.mr >= 0.5 ? Math.PI : 0, fy: Math.min(p.fy, -2) };
  return { ...p, sa: CARRY + (p.fx - 6) * 0.03, fy: Math.min(p.fy, CARRY_HAND) };
}

/** a clip at its time, legs together when she is in the air */
function play(h: Hero, clip: ActionClip): Pose {
  const p = sampleKeys(clip.keys, Math.min(h.st, clip.dur));
  return h.ground ? p : airborne(p);
}

/** her clip for a state: her own for her actions, her idle and the hover, the shared ones otherwise */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  switch (h.state) {
    case "staff":
    case "pendant":
      return sampleKeys(STAFF_CLIPS[mirel.current].keys, h.st);
    case "stillCast":
      return play(h, STILL_CAST);
    case "rewind":
      // Light Boots play the path back faster, and the clip with it
      return sampleKeys(REWIND_CLIP.keys, Math.min(REWIND.play, h.st * progress.stats.move));
    case "clockCast":
      return play(h, CLOCK_CLIP);
    case "handCast":
      return play(h, HAND_CLIP);
    case "spellCast":
      return play(h, SPELL_CLIP);
    case "hour":
      return play(h, HOUR_CLIP);
    case "noon":
      return play(h, NOON_CLIP);
    case "charge":
      return CHARGE_POSE;
    case "walk":
    case "idle": {
      const push = takeoffTime();
      if (push >= 0) return sampleKeys(MIREL_SETTLE.takeoff.keys, push);
      if (h.state === "walk") return carried(h, clipPose(h, t));
      const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
      const idle = woundedIdle(sampleKeys(MIREL_IDLE.keys, h.st % MIREL_IDLE.dur), wounded, wound);
      return wound > 0 ? carried(h, idle) : idle;
    }
    case "jump":
      return carried(h, sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)));
    case "fall":
      return mirel.hovering ? HOVER_POSE : carried(h, clipPose(h, t));
    default:
      return carried(h, clipPose(h, t));
  }
}

/**
 * Mirel's pose: her clips, the hover held still in the air, and Kael's motion layer for the jump's clock, the landings
 * and the hand-overs between clips. The hover crosses in from the fall pose over two frames.
 */
export function mirelPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  if (m.clip === "rewind" && clipKey(h) === "idle") settleRewind(t);
  const base = statePose(h, t, fresh, dt, woundWeight(t));
  const hovering = mirel.hovering && h.state === "fall";
  const toggled = hovering !== shown.hover;
  shown.hover = hovering;
  watchHandover(h, t, restarted || toggled, landed ? 1 : toggled ? HOVER_FRAMES : undefined);
  const p = handOver(mirelLanding(h, base, t), t);
  m.last = p;
  return p;
}
