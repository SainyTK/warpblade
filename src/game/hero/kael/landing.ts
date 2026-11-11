import { SETTLE_CLIPS } from "../../../constants/clips/settle";
import { ANIM_FPS, STAND } from "../../../constants/hero";
import { LANDING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clamp } from "../../../utils/math";
import { blendPose, shiftPose } from "../../../utils/poseBlend";
import { sampleKeys } from "../../../utils/sampleKeys";
import { motion } from "./motion";

/** watch for touchdown; true on the frame Kael lands from a fall worth bending the knees for */
export function watchLanding(h: Hero, t: number): boolean {
  const m = motion;
  if (!h.ground) {
    m.ground = false;
    m.airVy = h.vy;
    return false;
  }
  if (m.ground) return false;
  m.ground = true;
  if (m.airVy < LANDING.from) return false;
  m.landAt = t;
  m.landDepth = clamp((m.airVy - LANDING.from) / (LANDING.full - LANDING.from), 0.3, 1);
  return true;
}

/** the knees take the weight after a landing: standing, the landing clip; in a stride, a dip of the hips */
export function landingPose(h: Hero, p: Pose, t: number): Pose {
  const m = motion;
  const u = t - m.landAt;
  if (u >= LANDING.clipEnd) return p;
  if (h.state === "idle") {
    // the clip rises into the stand; it is steered on the way up into the idle's own pose, a wounded one too, so it meets it
    const rise = Math.floor(u * ANIM_FPS) / ANIM_FPS / LANDING.clipEnd;
    const land = shiftPose(sampleKeys(SETTLE_CLIPS.land.keys, u), STAND, p, rise);
    return blendPose(p, land, m.landDepth);
  }
  if (h.state !== "walk" && h.state !== "run") {
    // a move that touches down settles into the stand a step later, and the landing waits for it; any other state ends it
    if (u >= 1 / ANIM_FPS) m.landAt = Number.NEGATIVE_INFINITY;
    return p;
  }
  const k = Math.floor(u * ANIM_FPS);
  if (k >= LANDING.dipFrames) return p;
  const dip = LANDING.dip * m.landDepth * (1 - k / LANDING.dipFrames);
  return { ...p, hy: p.hy + dip, ny: p.ny + dip, fy: p.fy + dip * 0.7, by: p.by + dip * 0.7 };
}
