import { ANIM_FPS } from "../../../constants/hero";
import { WOUND_CROSS_FRAMES } from "../../../constants/lowHealth";
import type { Hero } from "../../../types/hero";
import type { WoundCross } from "../../../types/lowHealth";
import type { Pose } from "../../../types/pose";
import { blendPose } from "../../../utils/poseBlend";

/** the one owner of Ysra's cross into and out of her wounded idle */
const cross: WoundCross = { state: "idle", from: null, since: 0, frames: 0 };

/**
 * Ysra's clips start and end on her stand, so they meet without a jump; her wounded idle does not. While she is
 * wounded, a change into or out of idle crosses from the pose shown last over a few even frames. Unhurt, every
 * change cuts as it always has.
 */
export function crossWound(h: Hero, p: Pose, t: number, weight: number): Pose {
  if (h.state !== cross.state) {
    const frames = WOUND_CROSS_FRAMES[h.state] ?? WOUND_CROSS_FRAMES.other;
    const touchesIdle = h.state === "idle" || cross.state === "idle";
    cross.from = touchesIdle && weight > 0 && frames > 0 ? h.pose : null;
    cross.since = t;
    cross.frames = frames;
    cross.state = h.state;
  }
  if (!cross.from) return p;
  const k = Math.floor((t - cross.since) * ANIM_FPS + 1e-6);
  if (k >= cross.frames) {
    cross.from = null;
    return p;
  }
  return blendPose(cross.from, p, (k + 1) / (cross.frames + 1));
}

/** a fresh run: standing, nothing to cross from */
export function resetWoundCross(): void {
  Object.assign(cross, { state: "idle", from: null, since: 0, frames: 0 });
}
