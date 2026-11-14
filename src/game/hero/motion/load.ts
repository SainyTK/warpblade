import { ANIM_FPS } from "../../../constants/hero";
import { JUMP_LOAD, LOAD_BEND } from "../../../constants/takeoff";
import type { Pose } from "../../../types/pose";
import { blendPose } from "../../../utils/poseBlend";
import { loadStill, loadTime } from "../takeoff";

/** the load's frames: the knees bend through them, keyed per animation frame and deepest on the last */
const LOAD_FRAMES = Math.round(JUMP_LOAD * ANIM_FPS);

/**
 * The knees of a jump loading on the floor. From a stand, a hero with a crouch of its own sinks into it; otherwise the
 * bend is added to the stand or the stride under way, so the feet keep their step and hold the floor. Every hero's pose
 * runs through this, so every jump from the floor loads the same way.
 */
export function loadPose(p: Pose, crouch?: Pose): Pose {
  const t = loadTime();
  if (t < 0) return p;
  const u = Math.min(1, (Math.floor(t * ANIM_FPS + 1e-6) + 1) / LOAD_FRAMES);
  if (crouch && loadStill()) return blendPose(p, crouch, u);
  const b = LOAD_BEND;
  return {
    ...p,
    hy: p.hy + b.dip * u,
    ny: p.ny + (b.dip + b.duck) * u,
    nx: p.nx + b.lean * u,
    cb: p.cb + b.chest * u,
    fx: p.fx - b.draw * u,
    fy: p.fy + b.swing * u,
    bx: p.bx - b.draw * u,
    by: p.by + b.swing * u,
  };
}
