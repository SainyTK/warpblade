import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { hurting } from "../strike";

export const BELL = {
  hover: 66,
  drift: 26,
  sense: 110,
  below: 16,
  ring: 1,
  rattle: 0.6,
  toll: 0.45,
  reach: 76,
  dizzy: 1.5,
  sag: 34,
  drop: 300,
  grounded: 1.4,
  top: 22,
} as const;
export const BELL_HITS = { toll: 24, drop: 22 } as const;
export const BELL_MEND = 0.15;
export const TOLL = 0;
export const DROP = 1;

export const windTime = (e: Enemy): number => (e.n === TOLL ? BELL.ring : BELL.rattle) * waveScale(game.wave).windup;

export interface BellPose {
  swing: number;
  glow: number;
  limp: boolean;
  dull: boolean;
}

export function bellPose(e: Enemy, time: number): BellPose {
  const limp = hurting(e);
  if (limp) return { swing: 0.25, glow: 0, limp, dull: true };
  if (e.state === "wind") {
    const u = clamp(e.st / windTime(e));
    const rate = e.n === TOLL ? 9 : 30;
    return { swing: Math.sin(time * rate) * (e.n === TOLL ? 0.15 + u * 0.35 : 0.08), glow: u, limp, dull: false };
  }
  if (e.state === "beam") return { swing: Math.sin(time * 20) * 0.12, glow: 1, limp, dull: false };
  if (e.state === "dive") return { swing: 0, glow: 0.6, limp, dull: false };
  if (e.state === "recover")
    return { swing: Math.sin(time * 4) * 0.2 * (1 - clamp(e.st / BELL.dizzy)), glow: 0, limp, dull: true };
  return { swing: Math.sin(time * 1.6) * 0.08, glow: 0, limp, dull: false };
}
