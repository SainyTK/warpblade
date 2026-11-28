import { RUBRIC_SHOTS } from "./constants";
import type { ShotKind, ShotPlan } from "./types";

export function planShots(measures: readonly string[]): ShotPlan {
  return new Set<ShotKind>(measures.flatMap((id) => RUBRIC_SHOTS[id] ?? []));
}

export const wantsAny = (plan: ShotPlan, kinds: readonly ShotKind[]): boolean => kinds.some((kind) => plan.has(kind));
