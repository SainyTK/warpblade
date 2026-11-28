import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { WASP } from "./constants";
import { windTime } from "./moves";

export interface WaspPose {
  tilt: number;
  curl: number;
  heat: number;
  flap: number;
  bob: number;
}

const pose: WaspPose = { tilt: 0, curl: 0, heat: 0, flap: 0, bob: 0 };

const localAim = (e: Enemy): number => {
  const a = e.face > 0 ? e.ax : Math.PI - e.ax;
  return clamp(Math.atan2(Math.sin(a), Math.cos(a)), -1.1, 1.1);
};

export function waspPose(e: Enemy, t: number): WaspPose {
  const time = t + e.seed;
  const hurt = e.stun > 0 || e.stagger > 0 || e.air;
  pose.flap = Math.floor(time * 34) % 3;
  pose.bob = Math.round(Math.sin(time * 6) * 0.8);
  pose.tilt = 0.05;
  pose.curl = 0.1 + Math.sin(time * 3) * 0.06;
  pose.heat = 0;
  if (hurt) {
    pose.tilt = 0.35;
    pose.curl = 0.5;
    pose.flap = Math.floor(time * 12) % 3;
    return pose;
  }
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / windTime()));
    pose.tilt = localAim(e) * k * 0.7;
    pose.curl = lerp(0.1, 1, k);
    pose.heat = k;
    pose.bob = 0;
    return pose;
  }
  if (e.state === "lunge") {
    pose.tilt = localAim(e);
    pose.curl = 1;
    pose.heat = 1;
    pose.bob = 0;
    return pose;
  }
  if (e.state === "recover") {
    const k = clamp(e.st / WASP.recover);
    pose.tilt = lerp(localAim(e) * 0.5, 0.05, k);
    pose.curl = lerp(0.7, 0.1, k);
    pose.heat = clamp(0.6 - k * 1.5);
    pose.flap = Math.floor(time * (e.st < WASP.sag ? 16 : 34)) % 3;
  }
  return pose;
}
