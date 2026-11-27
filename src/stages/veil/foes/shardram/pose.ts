import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { DAZED, RAM } from "./constants";

export interface RamPose {
  lean: number;
  head: number;
  stride: number;
  heat: number;
  dazed: boolean;
  hurt: boolean;
}

export function ramPose(e: Enemy, time: number): RamPose {
  const pose: RamPose = { lean: 0, head: 0, stride: 0, heat: 0, dazed: false, hurt: false };
  if (e.stun > 0 || e.air || e.stagger > 0) return { ...pose, lean: -1.5, head: -2, stride: 1.5, hurt: true };
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / RAM.wind));
    return { ...pose, lean: -1.5 * k, head: 3 * k, stride: Math.sin(time * 18) * k, heat: k };
  }
  if (e.state === "charge") return { ...pose, lean: 1, head: 3.5, stride: Math.sin(time * 30) * 3, heat: 1 };
  if (e.state === "recover") {
    const dazed = e.n === DAZED;
    const k = clamp(e.st / (dazed ? RAM.dazed : RAM.recover));
    return { ...pose, head: dazed ? -1 : 3 * (1 - k), heat: 0.4 * (1 - k), dazed };
  }
  return { ...pose, stride: Math.abs(e.vx) > 3 ? Math.sin(time * 9) * 2 : 0 };
}
