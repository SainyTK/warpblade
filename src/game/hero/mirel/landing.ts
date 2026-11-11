import { MIREL_SETTLE } from "../../../constants/clips/mirel/settle";
import { STANCE } from "../../../constants/clips/mirel/stance";
import { ANIM_FPS } from "../../../constants/hero";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { blendPose, shiftPose } from "../../../utils/poseBlend";
import { sampleKeys } from "../../../utils/sampleKeys";
import { landingPose } from "../kael/landing";
import { motion } from "../kael/motion";

/** how deep the knees take the stop at the end of a Rewind on the floor, as a share of a full landing */
const REWIND_STOP = 0.6;

/** a Rewind that ends on the floor stops on bent knees, like a landing */
export function settleRewind(t: number): void {
  motion.landAt = t;
  motion.landDepth = REWIND_STOP;
}

/**
 * The knees take the weight after a landing. Standing, her own landing clip plays, steered on the way up into her idle
 * so it meets it; in a stride the shared hip dip plays.
 */
export function mirelLanding(h: Hero, p: Pose, t: number): Pose {
  const m = motion;
  const clip = MIREL_SETTLE.land;
  const u = t - m.landAt;
  if (h.state !== "idle" || u >= clip.dur) return landingPose(h, p, t);
  const rise = Math.floor(u * ANIM_FPS) / ANIM_FPS / clip.dur;
  const land = shiftPose(sampleKeys(clip.keys, u), STANCE, p, rise);
  return blendPose(p, land, m.landDepth);
}
