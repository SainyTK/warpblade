import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { RAY } from "./constants";
import { chargeTime, tuckTime } from "./timing";

export interface RayPose {
  flap: number;
  fold: number;
  tilt: number;
  charge: number;
  whip: number;
  limp: boolean;
}

const pose: RayPose = { flap: 0, fold: 0, tilt: 0, charge: 0, whip: 1, limp: false };

export function rayPose(e: Enemy, t: number): RayPose {
  const time = t + e.seed;
  pose.limp = e.stun > 0 || e.air;
  pose.flap = Math.sin(time * 2.6);
  pose.fold = 0;
  pose.tilt = 0;
  pose.charge = 0;
  pose.whip = 1;
  if (pose.limp) {
    pose.flap = -0.6;
    pose.fold = 0.3;
    pose.tilt = 0.35;
    pose.whip = 0.3;
    return pose;
  }
  if (e.state === "volley") {
    const k = clamp(e.st / chargeTime());
    pose.charge = k;
    pose.flap = lerp(pose.flap, 1, ease.outCubic(k));
    pose.whip = 1 + k * 1.5;
    return pose;
  }
  if (e.state === "shoot") {
    pose.charge = clamp(1 - e.st / 0.4);
    pose.flap = Math.sin(time * 4);
    return pose;
  }
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / tuckTime()));
    pose.fold = k * 0.85;
    pose.tilt = -0.2 * k;
    pose.flap = lerp(pose.flap, 0.6, k);
    return pose;
  }
  if (e.state === "dive") {
    const u = clamp(e.st / RAY.swoop);
    pose.fold = u < 0.6 ? 0.85 : lerp(0.85, 0, (u - 0.6) / 0.4);
    pose.tilt = Math.cos(Math.PI * u) * 0.45;
    pose.flap = u < 0.6 ? 0.4 : Math.sin(time * 8);
    pose.whip = 0.4;
    return pose;
  }
  if (e.state === "recover") pose.flap = Math.sin(time * 4.5);
  return pose;
}
