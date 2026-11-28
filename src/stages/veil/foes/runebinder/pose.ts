import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { BASH, BINDER } from "./constants";

export interface BinderPose {
  tx: number;
  ty: number;
  tilt: number;
  heat: number;
  lean: number;
  arms: number;
  sway: number;
}

const GUARD = { tx: 11, ty: -17, tilt: 0 } as const;

export function binderPose(e: Enemy, time: number): BinderPose {
  const sway = Math.sin(time * 2) * 0.6;
  const base: BinderPose = { ...GUARD, ty: GUARD.ty + Math.sin(time * 2.6), heat: 0, lean: 0, arms: 0, sway };
  if (e.stun > 0 || e.air || e.stagger > 0) return { ...base, tx: 8, ty: -6, tilt: 0.6, lean: -1.5 };
  if (e.state === "wind" && e.n === BASH) {
    const k = ease.outCubic(clamp(e.st / BINDER.bashWind));
    return { ...base, tx: lerp(11, 4, k), ty: -17, tilt: -0.3 * k, heat: k, lean: -1.5 * k, arms: 0.3 * k };
  }
  if (e.state === "wind" || e.state === "summon") {
    const k = ease.outCubic(clamp(e.st / BINDER.sealWind));
    return { ...base, tx: lerp(11, 6, k), ty: lerp(-17, -36, k), tilt: 0, heat: k, arms: k };
  }
  if (e.state === "swipe") {
    const k = ease.outExpo(clamp(e.st / BINDER.shove));
    return { ...base, tx: lerp(4, 19, k), ty: -16, tilt: 0.1, heat: 1, lean: 2 * k, arms: 0.4 };
  }
  if (e.state === "recover") {
    const k = clamp(e.st / BINDER.recover);
    return { ...base, tx: lerp(14, 11, k * k), ty: lerp(-5, -17, k * k), tilt: 0.5 * (1 - k), lean: 0.8 * (1 - k) };
  }
  return base;
}
