import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { HYPHA } from "./constants";

export type Pt = readonly [number, number];

export interface HyphaPose {
  lean: number;
  bob: number;
  stride: number;
  foot: Pt;
  tip: Pt;
  hand: Pt;
  bulb: number;
  gills: number;
}

const mix = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

function idle(time: number, walking: boolean): HyphaPose {
  const stride = walking ? Math.sin(time * 5) : 0;
  return {
    lean: 0,
    bob: walking ? Math.abs(stride) * 0.6 : Math.sin(time * 1.6) * 0.4,
    stride,
    foot: [12 + stride * 1.5, 0],
    tip: [12 + stride * 0.6, -40],
    hand: [10.5 + stride * 0.6, -21],
    bulb: 0.15 + Math.sin(time * 2.4) * 0.1,
    gills: 0.25 + Math.sin(time * 2) * 0.1,
  };
}

const RAISED: Pick<HyphaPose, "foot" | "tip" | "hand"> = { foot: [6, -16], tip: [9, -54], hand: [7.5, -33] };
const PLANTED: Pick<HyphaPose, "foot" | "tip" | "hand"> = { foot: [20, 0], tip: [21, -26], hand: [20, -14] };

function raised(base: HyphaPose, k: number, lean: number): HyphaPose {
  return {
    ...base,
    lean: lean * k,
    foot: mix(base.foot, RAISED.foot, k),
    tip: mix(base.tip, RAISED.tip, k),
    hand: mix(base.hand, RAISED.hand, k),
    bulb: lerp(base.bulb, 1, k),
    gills: lerp(base.gills, 1, k),
  };
}

export function poseOf(e: Enemy, time: number): HyphaPose {
  const windup = waveScale(game.wave).windup;
  const base = idle(time, e.state === "walk" && Math.abs(e.vx) > 3);
  if (e.state === "summon") return raised(base, ease.outCubic(clamp(e.st / (HYPHA.raise * windup))), -1.5);
  if (e.state === "wind") return raised(base, ease.outCubic(clamp(e.st / (HYPHA.lift * windup))), -1);
  if (e.state === "shoot") {
    const k = ease.outCubic(clamp(e.st / 0.08));
    return {
      ...base,
      lean: lerp(-1, 2.5, k),
      bob: 0.5 * k,
      foot: mix(RAISED.foot, PLANTED.foot, k),
      tip: mix(RAISED.tip, PLANTED.tip, k),
      hand: mix(RAISED.hand, PLANTED.hand, k),
      bulb: lerp(1, 0.6, clamp(e.st / HYPHA.plant)),
      gills: 0.8,
    };
  }
  if (e.state === "recover") {
    const k = ease.outQuad(clamp(e.st / HYPHA.recover));
    return {
      ...base,
      lean: lerp(1.5, 0, k),
      foot: mix(PLANTED.foot, base.foot, k),
      tip: mix(PLANTED.tip, base.tip, k),
      hand: mix(PLANTED.hand, base.hand, k),
      bulb: lerp(0.6, base.bulb, k),
      gills: lerp(0.7, base.gills, k),
    };
  }
  return base;
}
