import type { DrillPoses, DrillProfile } from "../../types/drill";
import { DEFAULT_POSES } from "./defaultPoses";

const cache = new WeakMap<DrillProfile, DrillPoses>();

export function drillPoses(profile: DrillProfile): DrillPoses {
  const known = cache.get(profile);
  if (known) {
    return known;
  }
  const poses = { ...DEFAULT_POSES, ...profile.poses };
  cache.set(profile, poses);
  return poses;
}
