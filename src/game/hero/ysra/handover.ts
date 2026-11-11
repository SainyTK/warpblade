import { ANIM_FPS } from "../../../constants/hero";
import { BLOW_HANDOVER_FRAMES, HANDOVER_FRAMES, TURN_FRAMES } from "../../../constants/ysra/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { blendPose } from "../../../utils/poseBlend";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { MOVES } from "../moves";

/** the clip Ysra showed last, and the cross out of it while one runs */
const motion = {
  clip: "idle",
  face: 1,
  st: 0,
  from: null as Pose | null,
  since: 0,
  frames: 0,
};
// each co-op player's Ysra crosses from her own last pose; only the host poses heroes
rememberPerSeat(objectMemory(motion, true));

const clipKey = (h: Hero): string => (h.state === "move" ? `move:${h.move}` : h.state);

/** frames a change into the state she is in now crosses over */
function crossFrames(h: Hero): number {
  if (h.state !== "move" || !h.move) return HANDOVER_FRAMES[h.state] ?? HANDOVER_FRAMES.other;
  const first = MOVES[h.move].hits[0];
  if (!first) return BLOW_HANDOVER_FRAMES;
  return Math.max(0, Math.min(BLOW_HANDOVER_FRAMES, Math.round(first.at * ANIM_FPS) - 1));
}

/** the last pose as it looks from the other side, for a turn: the same picture, flipped back by the new facing */
const turned = (p: Pose): Pose => ({ ...p, mr: p.mr >= 0.5 ? 0 : 1 });

/**
 * The clip's own pose, crossed from the pose shown last whenever the clip changes, starts over or she turns, over a
 * few even frames. A blow's wind-up starts from where the last blow's follow-through left her, and every blow, landing
 * and hurt settles back into her guard.
 */
export function handOver(h: Hero, p: Pose, t: number): Pose {
  const m = motion;
  const key = clipKey(h);
  const changed = key !== m.clip || h.st < m.st;
  const flipped = h.face !== m.face;
  m.st = h.st;
  if (changed || flipped) {
    m.from = flipped ? turned(h.pose) : h.pose;
    m.since = t;
    m.frames = changed ? crossFrames(h) : TURN_FRAMES;
    m.clip = key;
    m.face = h.face;
  }
  if (!m.from) return p;
  const k = Math.floor((t - m.since) * ANIM_FPS + 1e-6);
  if (k >= m.frames) {
    m.from = null;
    return p;
  }
  return blendPose(m.from, p, (k + 1) / (m.frames + 1));
}

/** a fresh run: standing, nothing to cross from */
export function resetHandover(): void {
  Object.assign(motion, { clip: "idle", face: 1, st: 0, from: null, since: 0, frames: 0 });
}
