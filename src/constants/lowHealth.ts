import type { HeroState } from "../types/hero";
import type { DangerTier } from "../types/lowHealth";
import { SPARKS } from "./palette";

/** the HP left, as a share of the most HP, where the warning starts and where it turns critical */
export const LOW_HEALTH = { low: 0.25, critical: 0.1 } as const;

/**
 * The red light glowing in from the screen edge. Low: a faint band breathing slowly. Critical: a wider, brighter band
 * beating like a heart. `fade` is the seconds the glow takes to cross one tier as HP falls or comes back.
 */
export const DANGER_GLOW = {
  color: SPARKS.blood[2],
  low: { strength: 0.36, band: 18, period: 1.8, pulse: 0.45 },
  critical: { strength: 0.62, band: 28, period: 0.85, pulse: 0.55 },
  fade: 0.45,
} as const satisfies { low: DangerTier; critical: DangerTier; color: number; fade: number };

/** animation frames the idle takes to sink into the wounded stance, or to straighten out of it after a heal */
export const WOUND_FRAMES = 12;

/** animation frames a hero crosses from her last pose into or out of a wounded idle; hits taken and death cut at once */
export const WOUND_CROSS_FRAMES: Partial<Record<HeroState, number>> & { other: number } = {
  idle: 3,
  walk: 3,
  run: 3,
  hurt: 0,
  dead: 0,
  other: 2,
};
