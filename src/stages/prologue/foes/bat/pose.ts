import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { batTell } from "./moves";

export interface BatPose {
  flap: number;
  spread: number;
  glare: number;
  hurt: boolean;
}

const pose: BatPose = { flap: 0, spread: 1, glare: 0, hurt: false };

export function batPose(e: Enemy, t: number): BatPose {
  const time = t + e.seed;
  pose.hurt = e.stagger > 0 || e.stun > 0 || e.air;
  pose.glare = 0;
  if (pose.hurt) {
    pose.flap = -0.9;
    pose.spread = 0.75;
    return pose;
  }
  if (e.state === "wind") {
    const k = clamp(e.st / batTell());
    pose.flap = 1.45 + k * 0.25 + Math.sin(time * 50) * 0.04;
    pose.spread = 0.72 - k * 0.1;
    pose.glare = k;
    return pose;
  }
  if (e.state === "dive") {
    pose.flap = 0.15;
    pose.spread = 0.8;
    pose.glare = 1;
    return pose;
  }
  pose.flap = Math.sin(time * (e.state === "recover" ? 16 : 22)) * 0.9;
  pose.spread = 1;
  return pose;
}
