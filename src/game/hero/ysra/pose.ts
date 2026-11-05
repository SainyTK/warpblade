import { YSRA_LOOPING, YSRA_STATE_CLIPS } from "../../../constants/clips/ysra";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { crossIntoVault } from "./stance/vaultEntry";

/** Ysra's pose for a state she has her own clip for; walk and run follow the stride, loops repeat, the rest play once.
 *  A vault crosses from the pose shown before it. */
export function ysraPose(h: Hero, _t: number): Pose | null {
  const clip = YSRA_STATE_CLIPS[h.state];
  if (!clip) return null;
  if (h.state === "walk" || h.state === "run") return sampleKeys(clip.keys, h.runPhase * clip.dur);
  if (h.state === "vault") return crossIntoVault(sampleKeys(clip.keys, h.st), h.st);
  return sampleKeys(clip.keys, YSRA_LOOPING.has(h.state) ? h.st % clip.dur : h.st);
}
