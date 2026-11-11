import { YSRA_LOOPING, YSRA_STATE_CLIPS } from "../../../constants/clips/ysra";
import { YSRA_WOUNDED_IDLE } from "../../../constants/clips/ysra/stanceWounded";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { clipPose } from "../clipPose";
import { loadPose } from "../kael/load";
import { woundedIdle, woundWeight } from "../wound";
import { handOver } from "./handover";
import { landingDip } from "./landingDip";
import { crossIntoVault } from "./stance/vaultEntry";

/** the squat her jump clip starts from: a jump from a stand loads into it, so the rise starts where the load ends */
const YSRA_CROUCH = YSRA_STATE_CLIPS.jump?.keys[0]?.[1];

/** her own clip for a state, or Kael's shared one; walk and run follow the stride, loops repeat, the rest play once.
 *  A vault crosses from the pose shown before it. */
function statePose(h: Hero, t: number): Pose {
  const clip = YSRA_STATE_CLIPS[h.state];
  if (!clip) return clipPose(h, t);
  if (h.state === "walk" || h.state === "run") return sampleKeys(clip.keys, h.runPhase * clip.dur);
  if (h.state === "vault") return crossIntoVault(sampleKeys(clip.keys, h.st), h.st);
  return sampleKeys(clip.keys, YSRA_LOOPING.has(h.state) ? h.st % clip.dur : h.st);
}

/** Ysra's pose: her clips, her idle sunk into the wounded stance as far as her HP calls for, each clip crossed into
 *  from the pose shown before it, and dipped by a landing */
export function ysraPose(h: Hero, t: number): Pose {
  const wound = woundWeight(t);
  const base = loadPose(statePose(h, t), YSRA_CROUCH);
  if (h.state !== "idle") return landingDip(h, handOver(h, base, t), t);
  const wounded = sampleKeys(YSRA_WOUNDED_IDLE.keys, h.st % YSRA_WOUNDED_IDLE.dur);
  return landingDip(h, handOver(h, woundedIdle(base, wounded, wound), t), t);
}
