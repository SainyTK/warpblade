import { SETTLE_CLIPS } from "../../../constants/clips/settle";
import { ANIM_FPS } from "../../../constants/hero";
import { LANDING } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clamp } from "../../../utils/math";
import { blendPose } from "../../../utils/poseBlend";
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
  if (h.state === "idle") return blendPose(p, sampleKeys(SETTLE_CLIPS.land.keys, u), m.landDepth);
  if (h.state !== "walk" && h.state !== "run") {
    m.landAt = Number.NEGATIVE_INFINITY;
    return p;
  }
  const k = Math.floor(u * ANIM_FPS);
  if (k >= LANDING.dipFrames) return p;
  const dip = LANDING.dip * m.landDepth * (1 - k / LANDING.dipFrames);
  return { ...p, hy: p.hy + dip, ny: p.ny + dip, fy: p.fy + dip * 0.7, by: p.by + dip * 0.7 };
}
