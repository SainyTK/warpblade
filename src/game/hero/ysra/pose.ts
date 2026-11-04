import { YSRA_LOOPING, YSRA_STATE_CLIPS } from "../../../constants/clips/ysra";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";

/** Ysra's pose for a state she has her own clip for; walk and run follow the stride, loops repeat, the rest play once */
export function ysraPose(h: Hero, _t: number): Pose | null {
  const clip = YSRA_STATE_CLIPS[h.state];
  if (!clip) return null;
  if (h.state === "walk" || h.state === "run") return sampleKeys(clip.keys, h.runPhase * clip.dur);
  return sampleKeys(clip.keys, YSRA_LOOPING.has(h.state) ? h.st % clip.dur : h.st);
}
