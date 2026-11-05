import { DANGER_GLOW, LOW_HEALTH } from "../constants/lowHealth";
import type { DangerState } from "../types/lowHealth";
import { dangerTarget, dangerTierAt, pulseAt } from "../utils/danger";
import { approach } from "../utils/math";
import { hero, progress } from "./state";

/** the one owner of the low health warning's state */
export const danger: DangerState = { level: 0, phase: 0 };

/** fade the warning toward the tier HP calls for, and move its pulse on */
export function updateDanger(dt: number): void {
  const target = dangerTarget(hero.hp, progress.stats.hp, LOW_HEALTH.low, LOW_HEALTH.critical);
  danger.level = approach(danger.level, target, dt / DANGER_GLOW.fade);
  const tier = dangerTierAt(danger.level, DANGER_GLOW.low, DANGER_GLOW.critical);
  danger.phase = (danger.phase + dt / tier.period) % 1;
}

/** a fresh run starts at full HP with no warning */
export function resetDanger(): void {
  danger.level = 0;
  danger.phase = 0;
}

/** the glow right now: its opacity at the screen edge and how far in it reaches, in art pixels */
export function dangerGlow(): { alpha: number; band: number } {
  const tier = dangerTierAt(danger.level, DANGER_GLOW.low, DANGER_GLOW.critical);
  const dip = tier.pulse * (1 - pulseAt(danger.phase, danger.level - 1));
  return { alpha: tier.strength * (1 - dip), band: tier.band };
}
