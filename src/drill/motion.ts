import type { DrillMotion, DrillProfile } from "../types/drill";
import { MOTION } from "./constants";

const cache = new WeakMap<DrillProfile, DrillMotion>();

export function drillMotion(profile: DrillProfile): DrillMotion {
  const known = cache.get(profile);
  if (known) {
    return known;
  }
  const motion = { ...MOTION, ...profile.motion };
  cache.set(profile, motion);
  return motion;
}
