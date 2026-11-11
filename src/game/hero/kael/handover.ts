import { ANIM_FPS } from "../../../constants/hero";
import { HANDOVER_FRAMES, STEP, TURN_FRAMES } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clamp } from "../../../utils/math";
import { blendPose } from "../../../utils/poseBlend";
import { motion } from "./motion";

/** the clip Kael shows: his state, and the move in it */
export const clipKey = (h: Hero): string => (h.state === "move" ? `move:${h.move}` : h.state);

/** the clips the hero stands or strides in on the floor; the feet step between them */
const STANDS = new Set(["idle", "walk", "run"]);

/** the last pose as it would look from the other side, for a turn: the same picture, flipped back by the new facing */
const turned = (p: Pose): Pose => ({ ...p, mr: p.mr >= 0.5 ? 0 : 1 });

/**
 * Start a hand-over when the clip changes, starts over or Kael turns: the pose shown last is where it crosses from.
 * `frames` overrides the state's own hand-over length.
 */
export function watchHandover(h: Hero, t: number, restarted: boolean, frames?: number): void {
  const m = motion;
  const key = clipKey(h);
  const changed = key !== m.clip || restarted;
  const flipped = h.face !== m.face;
  if (!changed && !flipped) return;
  const last = m.last;
  m.from = last && flipped ? turned(last) : last;
  m.since = t;
  m.step = changed && !flipped && h.ground && STANDS.has(key) && STANDS.has(m.clip);
  const stop = m.step && key === "idle";
  m.frames = changed ? (frames ?? (stop ? STEP.stopFrames : (HANDOVER_FRAMES[h.state] ?? 2))) : TURN_FRAMES;
  m.clip = key;
  m.face = h.face;
}

/** the clip's own pose, still part of the way from the last clip while the hand-over runs, at even steps */
export function handOver(p: Pose, t: number): Pose {
  const m = motion;
  if (!m.from) return p;
  const k = Math.floor((t - m.since) * ANIM_FPS + 1e-6);
  if (k >= m.frames) {
    m.from = null;
    return p;
  }
  const u = (k + 1) / (m.frames + 1);
  const crossed = blendPose(m.from, p, u);
  return m.step ? stepFeet(m.from, p, crossed, u) : crossed;
}

/**
 * Feet planted at both ends of a hand-over on the floor step across it: the foot with farther to go lifts and sets down
 * first, the other follows behind it, so no foot slides along the floor.
 */
function stepFeet(from: Pose, to: Pose, p: Pose, u: number): Pose {
  if (from.mr >= 0.5 !== to.mr >= 0.5) return p;
  const near = Math.abs(to.ffx - from.ffx);
  const far = Math.abs(to.bfx - from.bfx);
  const o = { ...p };
  const lead = clamp(u / (1 - STEP.lag));
  const trail = clamp((u - STEP.lag) / (1 - STEP.lag));
  const step = (x: "ffx" | "bfx", y: "ffy" | "bfy", share: number): void => {
    const d = to[x] - from[x];
    if (Math.abs(d) < STEP.min || from[y] < -0.6 || to[y] < -0.6) return;
    o[x] = from[x] + d * share;
    o[y] = -STEP.lift * Math.min(1, Math.abs(d) / STEP.span) * Math.sin(Math.PI * share);
  };
  step("ffx", "ffy", near >= far ? lead : trail);
  step("bfx", "bfy", near >= far ? trail : lead);
  return o;
}
