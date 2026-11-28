import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { hurting } from "../strike";

export const HOUND = {
  pace: 46,
  keep: 58,
  sense: 120,
  snapReach: 26,
  crouch: 0.7,
  snapWind: 0.42,
  pounce: 0.5,
  pounceSpeed: 230,
  past: 26,
  hop: 9,
  snap: 0.18,
  skid: 1.1,
  rest: 0.8,
} as const;
export const HOUND_HITS = { pounce: 20, snap: 16, touch: 8 } as const;
export const POUNCE = 0;
export const SNAP = 1;

export const windTime = (e: Enemy): number =>
  (e.n === POUNCE ? HOUND.crouch : HOUND.snapWind) * waveScale(game.wave).windup;

export interface HoundPose {
  crouch: number;
  stretch: number;
  gait: number;
  jaw: number;
  heat: number;
  limp: boolean;
  dim: boolean;
}

export function houndPose(e: Enemy, time: number): HoundPose {
  const limp = hurting(e);
  if (limp) return { crouch: 1.5, stretch: 0, gait: 0, jaw: 1, heat: 0, limp, dim: true };
  if (e.state === "wind") {
    const u = clamp(e.st / windTime(e));
    return { crouch: u * 3, stretch: 0, gait: 0, jaw: e.n === SNAP ? u * 1.6 : u * 0.6, heat: u, limp, dim: false };
  }
  if (e.state === "charge") return { crouch: -1, stretch: 1, gait: 0, jaw: 2, heat: 1, limp, dim: false };
  if (e.state === "swipe") return { crouch: 0.5, stretch: 0.6, gait: 0, jaw: 2.2, heat: 1, limp, dim: false };
  if (e.state === "recover") {
    const skid = e.n === POUNCE;
    return { crouch: skid ? 2 : 0.6, stretch: 0, gait: 0, jaw: 0.4, heat: 0, limp, dim: skid };
  }
  const speed = Math.min(1, Math.abs(e.vx) / HOUND.pace);
  return { crouch: 0, stretch: 0, gait: speed > 0.1 ? time * 11 : 0, jaw: 0, heat: 0, limp, dim: false };
}
