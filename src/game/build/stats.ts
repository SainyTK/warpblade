import type { BuildStats } from "../../types/build";
import { resonanceStats } from "../../utils/resonance";
import { progress } from "../state";

let cachedFor: unknown = null;
let cached: BuildStats | null = null;

export function currentBuildStats(): BuildStats {
  if (cached && cachedFor === progress.resonance) return cached;
  cachedFor = progress.resonance;
  cached = resonanceStats(progress.resonance);
  return cached;
}
