import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { aimTime } from "./behavior";
import { VOLTFLY } from "./constants";

export interface VoltflyPose {
  tilt: number;
  curl: number;
  stretch: number;
  beat: number;
  sweep: number;
  charge: number;
  limp: boolean;
}

const pose: VoltflyPose = { tilt: 0, curl: 0, stretch: 1, beat: 0, sweep: 0, charge: 0, limp: false };

export function voltflyPose(e: Enemy, t: number): VoltflyPose {
  const time = t + e.seed;
  pose.limp = e.stun > 0 || e.air;
  pose.beat = pose.limp ? 0.2 : Math.sin(time * 38);
  pose.tilt = 0;
  pose.curl = Math.sin(time * 2.2) * 0.4;
  pose.stretch = 1;
  pose.sweep = 0;
  pose.charge = 0;
  if (pose.limp) {
    pose.curl = 2.2;
    pose.tilt = 0.5;
    return pose;
  }
  if (e.state === "wind") {
    const k = clamp(e.st / aimTime());
    pose.charge = k;
    pose.curl = lerp(0, -2.6, k);
    pose.stretch = lerp(1, 0.88, k);
    pose.tilt = clamp((e.ay - e.y) / Math.max(1, Math.abs(e.ax - e.x)), -0.6, 0.6) * k;
    pose.beat = Math.sin(time * (38 + 40 * k));
    return pose;
  }
  if (e.state === "charge") {
    pose.charge = 1;
    pose.curl = 0.3;
    pose.stretch = 1.15;
    pose.sweep = 1;
    pose.tilt = clamp(e.vy / Math.max(1, Math.abs(e.vx)), -0.6, 0.6);
    return pose;
  }
  if (e.state === "recover") {
    const k = clamp(e.st / VOLTFLY.recover);
    pose.curl = lerp(1.8, 0, k);
    pose.sweep = lerp(0.6, 0, k);
    pose.tilt = lerp(-0.25, 0, k);
    return pose;
  }
  pose.tilt = clamp(e.vy / 220, -0.2, 0.2);
  pose.beat = Math.sin(time * 38 + Math.sin(game.t) * 0.1);
  return pose;
}
