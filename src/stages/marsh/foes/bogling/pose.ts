import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { BOGLING } from "./constants";
import { squashTime } from "./timing";

export interface BoglingPose {
  wide: number;
  tall: number;
  lift: number;
  lean: number;
  step: number;
  mouth: number;
  glow: number;
  dazed: boolean;
}

const pose: BoglingPose = { wide: 1, tall: 1, lift: 0, lean: 0, step: 0, mouth: 0, glow: 0, dazed: false };

function reset(): void {
  Object.assign(pose, { wide: 1, tall: 1, lift: 0, lean: 0, step: 0, mouth: 0, glow: 0, dazed: false });
}

export function boglingPose(e: Enemy, t: number): BoglingPose {
  const time = t + e.seed;
  reset();
  if (e.stagger > 0 || e.stun > 0 || e.air) {
    const wobble = Math.sin(time * 30) * 0.06;
    Object.assign(pose, { wide: 1.3 + wobble, tall: 0.7 - wobble, lean: -0.6, mouth: 0.4, dazed: true });
    return pose;
  }
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / squashTime()));
    const quiver = Math.sin(time * 50) * 0.04 * k;
    Object.assign(pose, { wide: 1 + 0.32 * k + quiver, tall: 1 - 0.3 * k, lean: -0.8 * k, mouth: k, glow: k });
    return pose;
  }
  if (e.state === "lunge") {
    const rising = e.vy < 0;
    Object.assign(pose, { wide: rising ? 0.82 : 0.92, tall: rising ? 1.22 : 1.08, lean: 1.4, mouth: 1, glow: 1 });
    return pose;
  }
  if (e.state === "recover") {
    const k = clamp(e.st / BOGLING.recover);
    const settle = (1 - k) * Math.cos(k * 9) * 0.22;
    Object.assign(pose, { wide: 1 + settle, tall: 1 - settle });
    return pose;
  }
  const hop = Math.abs(Math.sin(time * 6));
  Object.assign(pose, { wide: 1 + (1 - hop) * 0.08, tall: 1 - (1 - hop) * 0.08 + hop * 0.04, lift: hop * 0.8 });
  pose.step = Math.sin(time * 6);
  return pose;
}
