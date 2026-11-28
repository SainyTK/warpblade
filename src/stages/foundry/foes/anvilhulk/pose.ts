import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { HULK_TIMES, venting } from "./moves";

type Pt = readonly [number, number];

export interface HulkPose {
  near: Pt;
  far: Pt;
  crouch: number;
  hatch: number;
  heat: number;
  step: number;
}

const mix = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const HANG = { near: [11, -13] as Pt, far: [-9, -14] as Pt };
const HIGH = { near: [5, -50] as Pt, far: [-3, -49] as Pt };
const FLOOR = { near: [14, -4] as Pt, far: [8, -4] as Pt };

export function hulkPose(e: Enemy, time: number): HulkPose {
  if (e.state === "wind") {
    const u = clamp(e.st / HULK_TIMES.raise);
    const lift = Math.min(1, u * 1.6);
    const tremble = u > 0.6 ? Math.sin(time * 50) * 0.4 : 0;
    return {
      near: mix(HANG.near, [HIGH.near[0] + tremble, HIGH.near[1]], lift),
      far: mix(HANG.far, HIGH.far, lift),
      crouch: -lift * 2,
      hatch: 0,
      heat: u,
      step: 0,
    };
  }
  if (e.state === "swipe") return { near: FLOOR.near, far: FLOOR.far, crouch: 3, hatch: 0.3, heat: 1, step: 0 };
  if (e.state === "recover" && venting(e)) {
    const u = clamp(e.st / HULK_TIMES.vent);
    return {
      near: mix(FLOOR.near, HANG.near, u),
      far: mix(FLOOR.far, HANG.far, u),
      crouch: 3 * (1 - u),
      hatch: u < 0.85 ? 1 : (1 - u) / 0.15,
      heat: 0.5,
      step: 0,
    };
  }
  if (e.state === "charge") {
    const u = clamp(e.st / HULK_TIMES.coil);
    return { near: mix(HANG.near, [-6, -22], u), far: HANG.far, crouch: u, hatch: 0, heat: u, step: 0 };
  }
  if (e.state === "shoot") return { near: [25, -19], far: HANG.far, crouch: 0.5, hatch: 0, heat: 1, step: 0 };
  if (e.state === "recover") return { near: [18, -16], far: HANG.far, crouch: 0.5, hatch: 0, heat: 0.3, step: 0 };
  const stride = e.state === "walk" ? Math.sin(time * 4) : 0;
  return {
    near: [HANG.near[0] + stride, HANG.near[1] + Math.abs(stride) * 0.5],
    far: [HANG.far[0] - stride, HANG.far[1] + Math.abs(stride) * 0.5],
    crouch: Math.abs(stride) * 0.6,
    hatch: 0,
    heat: 0,
    step: stride,
  };
}
