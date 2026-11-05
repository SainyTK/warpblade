import { ANIM_FPS } from "../../../constants/hero";
import { HANDOVER_FRAMES, TURN_FRAMES } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { blendPose } from "../../../utils/poseBlend";
import { motion } from "./motion";

/** the clip Kael shows: his state, and the move in it */
export const clipKey = (h: Hero): string => (h.state === "move" ? `move:${h.move}` : h.state);

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
  m.frames = changed ? (frames ?? HANDOVER_FRAMES[h.state] ?? 2) : TURN_FRAMES;
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
  return blendPose(m.from, p, (k + 1) / (m.frames + 1));
}
