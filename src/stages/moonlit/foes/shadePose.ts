import { game } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";

export const SHADE = { flare: 0.8, throwTime: 0.25, recover: 0.8, keepAway: 40, hover: 46, sense: 150 } as const;

export const flareTime = (): number => SHADE.flare * waveScale(game.wave).windup;

export function flareOf(e: Enemy): number {
  if (e.stun > 0 || e.air) return 0;
  if (e.state === "wind") return clamp(e.st / flareTime());
  if (e.state === "shoot") return 1 - clamp(e.st / SHADE.throwTime) * 0.6;
  return 0;
}

export function lanternAt(e: Enemy, t: number): [number, number] {
  const sway = Math.sin((t + e.seed) * 2.1) * 1.2;
  const lift = e.state === "wind" ? -3 * flareOf(e) : 0;
  return [e.x + e.face * (9 + sway * 0.4), e.y + 4 + lift + Math.abs(sway) * 0.3];
}
