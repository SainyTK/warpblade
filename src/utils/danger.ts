import type { DangerTier } from "../types/lowHealth";
import { clamp, lerp } from "./math";

/** the warning level HP calls for: 0 above the low share, 1 at or under it, 2 at or under the critical share */
export function dangerTarget(hp: number, maxHp: number, low: number, critical: number): number {
  const share = maxHp > 0 ? hp / maxHp : 1;
  if (share <= critical) return 2;
  if (share <= low) return 1;
  return 0;
}

/** the glow at a level between 0 and 2: fading in up to the low tier, then growing into the critical one */
export function dangerTierAt(level: number, low: DangerTier, critical: DangerTier): DangerTier {
  if (level <= 1) return { ...low, strength: low.strength * clamp(level) };
  const u = clamp(level - 1);
  return {
    strength: lerp(low.strength, critical.strength, u),
    band: lerp(low.band, critical.band, u),
    period: lerp(low.period, critical.period, u),
    pulse: lerp(low.pulse, critical.pulse, u),
  };
}

const bump = (p: number, at: number, width: number): number => Math.exp(-(((p - at) / width) ** 2));

/**
 * The pulse at a phase, 0 to 1: a slow, even swell at the low tier (beat 0), a heartbeat at the critical tier (beat 1),
 * a strong beat and a softer one close behind it.
 */
export function pulseAt(phase: number, beat: number): number {
  const swell = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
  const heart = Math.min(1, bump(phase, 0.12, 0.09) + bump(phase, 0.34, 0.09) * 0.65 + bump(phase, 1.12, 0.09));
  return lerp(swell, heart, clamp(beat));
}

/** how strongly a pixel this far from the nearest side and from the nearest top or bottom glows, 0 to 1 */
export function edgeWeight(dx: number, dy: number, band: number): number {
  const wx = Math.max(0, 1 - dx / band) ** 2;
  const wy = Math.max(0, 1 - dy / band) ** 2;
  return 1 - (1 - wx) * (1 - wy);
}
