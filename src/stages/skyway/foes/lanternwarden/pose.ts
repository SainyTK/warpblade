import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FLASH, WARD } from "./constants";

type Pt = readonly [number, number];

export interface WardenPose {
  lean: number;
  stride: number;
  hand: Pt;
  tip: Pt;
  light: number;
  dim: boolean;
}

const HAND: Pt = [7, -25];
const TIP: Pt = [10, -52];
const mixPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export function wardenPose(e: Enemy, time: number): WardenPose {
  const scale = waveScale(game.wave).windup;
  if (e.state === "summon") {
    const u = clamp(e.st / (WARD.windup * scale));
    return {
      lean: -0.8 * u,
      stride: 0,
      hand: mixPt(HAND, [6, -36], u),
      tip: mixPt(TIP, [8, -64], u),
      light: 0.5 + u * 0.5,
      dim: false,
    };
  }
  if (e.state === "wind") {
    const u = clamp(e.st / (FLASH.windup * scale));
    const tremble = u > 0.75 ? Math.sin(time * 60) * 0.4 : 0;
    return {
      lean: -2 * u + tremble,
      stride: 0,
      hand: mixPt(HAND, [2, -30], u),
      tip: mixPt(TIP, [-8, -54], u),
      light: 0.4 + u * 0.6,
      dim: false,
    };
  }
  if (e.state === "beam") return { lean: 2.5, stride: 1.5, hand: [11, -25], tip: [27, -28], light: 1, dim: false };
  if (e.state === "recover")
    return e.n > 0
      ? { lean: 0, stride: 0, hand: HAND, tip: TIP, light: 0.6, dim: false }
      : { lean: 1.5, stride: 1, hand: [11, -22], tip: [26, -20], light: 0, dim: true };
  const walking = Math.abs(e.vx) > 3;
  const swing = walking ? Math.sin(time * 5) : 0;
  const bob = Math.abs(swing) * 0.4;
  return {
    lean: 0,
    stride: swing * 2,
    hand: [HAND[0], HAND[1] + bob],
    tip: [TIP[0] + swing * 0.8, TIP[1] + bob],
    light: 0.45,
    dim: false,
  };
}
