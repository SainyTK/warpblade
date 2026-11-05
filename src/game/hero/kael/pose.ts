import { STATE_CLIPS } from "../../../constants/clips";
import { KAEL_WOUNDED_IDLE } from "../../../constants/clips/wounded";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { woundedIdle, woundWeight } from "../wound";
import { clipKey, handOver, watchHandover } from "./handover";
import { hangSwing } from "./hangSwing";
import { jumpClock } from "./jumpClock";
import { landingPose, watchLanding } from "./landing";
import { motion } from "./motion";
import { windupCross } from "./windup";

/** the clip Kael's state plays, his idle sunk into the wounded stance as far as his HP calls for */
function statePose(h: Hero, t: number, fresh: boolean, dt: number, wound: number): Pose {
  if (h.state === "jump") return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt));
  if (h.state !== "idle") return clipPose(h, t);
  const wounded = sampleKeys(KAEL_WOUNDED_IDLE.keys, h.st % KAEL_WOUNDED_IDLE.dur);
  return woundedIdle(clipPose(h, t), wounded, wound);
}

/**
 * Kael's pose: his clips, with the jump's clock following the rise, the knees taking each landing, the body swinging in under a crystal it caught, and every change of
 * clip or facing crossed over a few even frames instead of cut.
 */
export function kaelPose(h: Hero, t: number): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  const base = statePose(h, t, fresh, dt, woundWeight(t));
  watchHandover(h, t, restarted, landed ? 1 : h.state === "move" ? windupCross(h) : undefined);
  const p = handOver(hangSwing(h, landingPose(h, base, t)), t);
  m.last = p;
  return p;
}
