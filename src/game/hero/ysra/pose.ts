import { YSRA_LOOPING, YSRA_STATE_CLIPS } from "../../../constants/clips/ysra";
import { YSRA_WOUNDED_IDLE } from "../../../constants/clips/ysra/stanceWounded";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { woundedIdle, woundWeight } from "../wound";
import { crossWound } from "./woundCross";

/** her own clip for a state, or Kael's shared one; walk and run follow the stride, loops repeat, the rest play once */
function statePose(h: Hero, t: number): Pose {
  const clip = YSRA_STATE_CLIPS[h.state];
  if (!clip) return clipPose(h, t);
  if (h.state === "walk" || h.state === "run") return sampleKeys(clip.keys, h.runPhase * clip.dur);
  return sampleKeys(clip.keys, YSRA_LOOPING.has(h.state) ? h.st % clip.dur : h.st);
}

/** Ysra's pose: her clips, her idle sunk into the wounded stance as far as her HP calls for, crossed into and out of */
export function ysraPose(h: Hero, t: number): Pose {
  const wound = woundWeight(t);
  const base = statePose(h, t);
  if (h.state !== "idle") return crossWound(h, base, t, wound);
  const wounded = sampleKeys(YSRA_WOUNDED_IDLE.keys, h.st % YSRA_WOUNDED_IDLE.dur);
  return crossWound(h, woundedIdle(base, wounded, wound), t, wound);
}
