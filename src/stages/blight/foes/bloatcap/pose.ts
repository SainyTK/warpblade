import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { rainTime } from "./behavior";
import { BLOAT_TIMES } from "./timing";

export interface BloatPose {
  open: number;
  squash: number;
  shiver: number;
  maw: number;
  drop: number;
}

export function poseOf(e: Enemy, time: number): BloatPose {
  const breath = Math.sin(time * 1.8) * 0.03;
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / rainTime()));
    return { open: k, squash: 1 - 0.14 * k + breath, shiver: k * 0.35, maw: 0.5 * k, drop: k * 2 };
  }
  if (e.state === "shoot") {
    const k = clamp(e.st / BLOAT_TIMES.fall);
    return { open: 1, squash: lerp(1.14, 1, k), shiver: 0, maw: 1, drop: lerp(3, 2, k) };
  }
  if (e.state === "summon") {
    const k = clamp(e.st / BLOAT_TIMES.summon);
    return { open: 0.75, squash: 1 + Math.sin(time * 26) * 0.05, shiver: 0.4 + k * 0.5, maw: 0.7, drop: 1 };
  }
  if (e.state === "recover") {
    const k = clamp(e.st / BLOAT_TIMES.recover);
    return { open: lerp(1, 0.35, k), squash: 1 + breath, shiver: 0, maw: lerp(0.7, 0.15, k), drop: lerp(2, 0, k) };
  }
  return { open: 0, squash: 1 + breath, shiver: 0, maw: 0.12, drop: 0 };
}
