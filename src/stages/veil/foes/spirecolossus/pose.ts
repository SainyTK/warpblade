import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { windTime } from "./behavior";
import { COLOSSUS, SLAM } from "./constants";

export type Pt = readonly [number, number];

export interface ColossusPose {
  near: Pt;
  far: Pt;
  lean: number;
  stride: number;
  heat: number;
  open: number;
  bob: number;
}

export function colossusPose(e: Enemy, time: number): ColossusPose {
  const bob = Math.sin(time * 2.2) * 0.8;
  const rest: ColossusPose = {
    near: [13, -20 + bob],
    far: [-10, -22 - bob],
    lean: 0,
    stride: Math.abs(e.vx) > 2 ? Math.sin(time * 5) * 2 : 0,
    heat: 0,
    open: 0,
    bob,
  };
  if (e.stun > 0 || e.air) return { ...rest, lean: -1.5, open: 0.6 };
  if (e.state === "wind" && e.n === SLAM) {
    const k = ease.outCubic(clamp(e.st / windTime(e)));
    return {
      ...rest,
      near: [lerp(13, 12, k), lerp(-20, -64, k)],
      far: [lerp(-10, 3, k), lerp(-22, -67, k)],
      lean: -2 * k,
      heat: k,
    };
  }
  if (e.state === "wind" || e.state === "summon") {
    const k = ease.outCubic(clamp(e.state === "summon" ? 1 : e.st / windTime(e)));
    return { ...rest, near: [lerp(13, 14, k), lerp(-20, -66, k)], lean: -k, heat: k };
  }
  if (e.state === "swipe") {
    const k = ease.outExpo(clamp(e.st / COLOSSUS.slam));
    return {
      ...rest,
      near: [lerp(12, 22, k), lerp(-64, -5, k)],
      far: [lerp(3, 15, k), lerp(-67, -6, k)],
      lean: 3 * k,
      heat: 1,
    };
  }
  if (e.state === "recover") {
    const k = clamp(e.st / COLOSSUS.recover);
    const settle = k * k;
    return {
      ...rest,
      near: [lerp(22, 13, settle), lerp(-5, -20, settle)],
      far: [lerp(15, -10, settle), lerp(-6, -22, settle)],
      lean: 3 * (1 - settle),
      open: 1 - settle,
    };
  }
  return rest;
}
