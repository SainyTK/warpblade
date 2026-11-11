import { HULDA_LAND } from "../../../constants/clips/hulda/settle";
import { GUARD } from "../../../constants/clips/hulda/stance";
import { ANIM_FPS } from "../../../constants/hero";
import { HULDA_LANDING } from "../../../constants/hulda/motion";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { clamp } from "../../../utils/math";
import { blendPose, shiftPose } from "../../../utils/poseBlend";
import { sampleKeys } from "../../../utils/sampleKeys";
import { motion } from "../kael/motion";

/** watch for touchdown; true on the frame she lands from a fall worth bending the knees for */
export function watchHuldaLanding(h: Hero, t: number): boolean {
  const m = motion;
  if (!h.ground) {
    m.ground = false;
    m.airVy = h.vy;
    return false;
  }
  if (m.ground) return false;
  m.ground = true;
  if (m.airVy < HULDA_LANDING.from) return false;
  m.landAt = t;
  m.landDepth = clamp((m.airVy - HULDA_LANDING.from) / (HULDA_LANDING.full - HULDA_LANDING.from), 0.4, 1);
  return true;
}

/**
 * Her knees take her weight after a landing: standing, her landing clip, rising into whatever her idle shows; in a
 * stride, a dip of the hips. The harder the fall, the deeper she sinks.
 */
export function huldaLandingPose(h: Hero, p: Pose, t: number): Pose {
  const m = motion;
  const u = t - m.landAt;
  if (u >= HULDA_LAND.dur) return p;
  if (h.state === "idle") {
    const rise = Math.floor(u * ANIM_FPS) / ANIM_FPS / HULDA_LAND.dur;
    const land = shiftPose(sampleKeys(HULDA_LAND.keys, u), GUARD, p, rise);
    return blendPose(p, land, m.landDepth);
  }
  if (h.state !== "walk") {
    m.landAt = Number.NEGATIVE_INFINITY;
    return p;
  }
  const k = Math.floor(u * ANIM_FPS);
  if (k >= HULDA_LANDING.dipFrames) return p;
  const dip = HULDA_LANDING.dip * m.landDepth * (1 - k / HULDA_LANDING.dipFrames);
  return { ...p, hy: p.hy + dip, ny: p.ny + dip, fy: p.fy + dip * 0.7, by: p.by + dip * 0.7 };
}
