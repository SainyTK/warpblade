import type { DrillProfile, ResolvedDrillBody } from "../../types/drill";
import { MOTION } from "../constants";
import { runPose } from "../view/runPose";
import { DEFAULT_POSES } from "./defaultPoses";

const resolved = new WeakMap<DrillProfile, ResolvedDrillBody>();

export function drillBody(profile: DrillProfile): ResolvedDrillBody {
  const known = resolved.get(profile);
  if (known) {
    return known;
  }
  const body = profile.body;
  const next: ResolvedDrillBody = {
    poses: { ...DEFAULT_POSES, ...body?.poses },
    run: body?.run ?? runPose,
    motion: { ...MOTION, ...body?.motion },
    landing: body?.landing ?? 1,
  };
  resolved.set(profile, next);
  return next;
}
