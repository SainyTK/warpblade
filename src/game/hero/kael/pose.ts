import { STATE_CLIPS } from "../../../constants/clips";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { clipKey, handOver, watchHandover } from "./handover";
import { hangSwing } from "./hangSwing";
import { jumpClock } from "./jumpClock";
import { landingPose, watchLanding } from "./landing";
import { motion } from "./motion";
import { windupCross } from "./windup";

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
  const base = h.state === "jump" ? sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, fresh, dt)) : clipPose(h, t);
  watchHandover(h, t, restarted, landed ? 1 : h.state === "move" ? windupCross(h) : undefined);
  const p = handOver(hangSwing(h, landingPose(h, base, t)), t);
  m.last = p;
  return p;
}
