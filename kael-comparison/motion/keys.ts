import { POSE_KEYS, type Pose } from "../../src/types/pose";
import { clamp, lerp } from "../../src/utils/math";
import type { Sample } from "./types";

export type Key = readonly [time: number, sample: Sample];
const discrete = new Set(["tw", "mr", "be", "fe", "bs"]);

export function keyed(keys: readonly Key[], time: number): Sample {
  const next = keys.findIndex(([t]) => t > time);
  if (next === 0) {
    return keys[0][1];
  }
  if (next === -1) {
    return keys[keys.length - 1][1];
  }
  const [a, from] = keys[next - 1];
  const [b, to] = keys[next];
  const u = clamp((time - a) / (b - a));
  const spacing = u * u * (3 - 2 * u);
  const pose: Pose = { ...from.pose };
  for (const key of POSE_KEYS) {
    if (!discrete.has(key)) {
      pose[key] = lerp(from.pose[key], to.pose[key], spacing);
    }
  }
  return {
    ...from,
    pose,
    lift: lerp(from.lift, to.lift, spacing),
    root: lerp(from.root, to.root, spacing),
    profile: lerp(from.profile ?? 1, to.profile ?? 1, spacing),
  };
}
