import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLOTMOTH } from "./moves";

export interface BlotmothPose {
  flap: number;
  pitch: number;
  hot: boolean;
  dazed: boolean;
}

export function blotmothPose(e: Enemy, time: number): BlotmothPose {
  const dazed = e.stagger > 0 || e.stun > 0;
  if (dazed) return { flap: Math.sin(time * 6) * 0.3, pitch: 0.4, hot: false, dazed };
  if (e.state === "wind") {
    const k = clamp(e.st / (BLOTMOTH.wind * waveScale(game.wave).windup));
    return { flap: -1 + Math.sin(time * 40) * 0.08 * k, pitch: -0.35 * k, hot: true, dazed };
  }
  if (e.state === "dive") {
    const u = clamp(e.st / BLOTMOTH.swoop);
    return { flap: 0.75, pitch: u < 0.5 ? 0.5 : -0.4, hot: true, dazed };
  }
  const rate = e.state === "recover" ? 16 : 20;
  return { flap: Math.sin(time * rate), pitch: 0, hot: false, dazed };
}
