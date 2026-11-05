import { ANIM_FPS } from "../../../../constants/hero";
import { VAULT } from "../../../../constants/ysra/stance";
import type { Pose } from "../../../../types/pose";
import { blendPose } from "../../../../utils/poseBlend";
import { stance } from "./memory";

/** the pose she held, as the vault will cross from it: seen from the other side when the vault turns her round */
export const entryPose = (last: Pose, turns: boolean): Pose => (turns ? { ...last, mr: last.mr >= 0.5 ? 0 : 1 } : last);

/** the vault's own pose, part of the way from the pose shown before it for its first frames, at even steps */
export function crossIntoVault(p: Pose, st: number): Pose {
  const from = stance.entry;
  if (!from) return p;
  const k = Math.floor(st * ANIM_FPS + 1e-6);
  if (k >= VAULT.entryFrames) {
    stance.entry = null;
    return p;
  }
  return blendPose(from, p, (k + 1) / (VAULT.entryFrames + 1));
}
