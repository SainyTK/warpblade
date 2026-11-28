import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { TITAN_TIMES } from "./moves";

type Pt = readonly [number, number];

export interface TitanPose {
  near: Pt;
  far: Pt;
  crouch: number;
  maw: number;
  heat: number;
  step: number;
}

const mix = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const HANG = { near: [15, -16] as Pt, far: [-13, -17] as Pt };
const HIGH = { near: [8, -66] as Pt, far: [-2, -64] as Pt };
const FLOOR = { near: [20, -5] as Pt, far: [12, -5] as Pt };
const SPREAD = { near: [20, -30] as Pt, far: [-17, -30] as Pt };

export function titanPose(e: Enemy, time: number): TitanPose {
  if (e.state === "wind") {
    const u = clamp(e.st / TITAN_TIMES.raise);
    const lift = Math.min(1, u * 1.5);
    const tremble = u > 0.65 ? Math.sin(time * 45) * 0.5 : 0;
    return {
      near: mix(HANG.near, [HIGH.near[0] + tremble, HIGH.near[1]], lift),
      far: mix(HANG.far, HIGH.far, lift),
      crouch: -lift * 2,
      maw: 0,
      heat: u,
      step: 0,
    };
  }
  if (e.state === "swipe") return { near: FLOOR.near, far: FLOOR.far, crouch: 4, maw: 0.2, heat: 1, step: 0 };
  if (e.state === "summon") {
    const u = clamp(e.st / TITAN_TIMES.stoke);
    return {
      near: mix(HANG.near, SPREAD.near, u),
      far: mix(HANG.far, SPREAD.far, u),
      crouch: -u,
      maw: u,
      heat: u,
      step: 0,
    };
  }
  if (e.state === "recover") {
    const spent = e.n === 1;
    const u = clamp(e.st / (spent ? TITAN_TIMES.spent : TITAN_TIMES.cool));
    const from = spent ? SPREAD : FLOOR;
    return {
      near: mix(from.near, HANG.near, u),
      far: mix(from.far, HANG.far, u),
      crouch: spent ? 0 : 4 * (1 - u),
      maw: u < 0.85 ? 1 : (1 - u) / 0.15,
      heat: 0.6,
      step: 0,
    };
  }
  const stride = e.state === "walk" ? Math.sin(time * 3.2) : 0;
  return {
    near: [HANG.near[0] + stride * 1.5, HANG.near[1] + Math.abs(stride)],
    far: [HANG.far[0] - stride * 1.5, HANG.far[1] + Math.abs(stride)],
    crouch: Math.abs(stride) * 0.8,
    maw: 0,
    heat: 0.1,
    step: stride,
  };
}
