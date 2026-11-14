import { LANDING } from "../../../constants/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clipKey, handOver, watchHandover } from "./handover";
import { landingPose, watchLanding } from "./landing";
import { loadPose } from "./load";
import { motion } from "./memory";
import { travelPose, watchTravel } from "./travel";

export { jumpClock } from "./jumpClock";
export { resetMotion } from "./memory";

/** what the motion layer tells a hero's own clip sampler about this frame */
export interface MotionFrame {
  /** the clip changed or started over this frame */
  fresh: boolean;
  /** game seconds since the last pose */
  dt: number;
}

/**
 * The motion layer every hero's pose goes through (docs/motion-standard.md): a load at the start of every walk, run,
 * dash and jump, the knees taking each landing and each stop, and every change of clip or facing crossed over a few
 * even frames instead of cut. `statePose` is the hero's own: the clip its state plays at this moment. A kit calls this
 * from its `pose`, resets it with `resetMotion` in its `reset`, and samples its jump clip with `jumpClock`.
 */
export function motionPose(h: Hero, t: number, statePose: (h: Hero, t: number, frame: MotionFrame) => Pose): Pose {
  const m = motion;
  const dt = Math.max(0, t - m.t);
  m.t = t;
  const restarted = clipKey(h) === m.clip && h.st < m.st - 1e-6;
  const fresh = clipKey(h) !== m.clip || restarted;
  m.st = h.st;
  const landed = watchLanding(h, t);
  watchTravel(h, t, m.clip);
  const base = loadPose(travelPose(h, statePose(h, t, { fresh, dt }), t));
  watchHandover(h, t, restarted, landed ? LANDING.cross : undefined);
  const p = handOver(landingPose(h, base, t), t);
  m.last = p;
  return p;
}
