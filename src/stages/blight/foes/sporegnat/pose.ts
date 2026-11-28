import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GNAT_TIMES } from "./moves";

export interface GnatPose {
  wing: number;
  pitch: number;
  glow: number;
  tumble: boolean;
}

export function gnatPose(e: Enemy, time: number): GnatPose {
  const beat = Math.sin(time * 48);
  if (e.stagger > 0 || e.stun > 0 || e.air) return { wing: Math.sin(time * 14), pitch: 0.9, glow: 0, tumble: true };
  if (e.state === "wind") {
    const k = clamp(e.st / (GNAT_TIMES.rise * waveScale(game.wave).windup));
    return { wing: beat, pitch: -0.45 * k, glow: k, tumble: false };
  }
  if (e.state === "dive") return { wing: beat * 0.4 - 0.6, pitch: 0.55, glow: 1, tumble: false };
  return { wing: beat, pitch: 0, glow: 0, tumble: false };
}
