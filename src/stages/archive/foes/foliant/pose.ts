import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { unbound } from "./behavior";
import { FOLIANT } from "./moves";

type Pt = readonly [number, number];

export interface FoliantPose {
  near: Pt;
  far: Pt;
  drop: number;
  stride: number;
  open: number;
  glow: number;
}

const mixPt = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const REST = { near: [11, -15] as Pt, far: [-10, -16] as Pt };
const OVERHEAD = { near: [6, -50] as Pt, far: [-4, -51] as Pt };

export function foliantPose(e: Enemy, time: number): FoliantPose {
  const windup = waveScale(game.wave).windup;
  if (e.state === "wind") {
    const k = clamp(e.st / (FOLIANT.slamWind * windup * 0.6));
    const strain = clamp(e.st / (FOLIANT.slamWind * windup));
    return {
      near: mixPt(REST.near, OVERHEAD.near, k),
      far: mixPt(REST.far, OVERHEAD.far, k),
      drop: -1.5 * k,
      stride: 0,
      open: 0,
      glow: strain,
    };
  }
  if (e.state === "swipe") return { near: [14, -4], far: [6, -4], drop: 5, stride: 0, open: 0.3, glow: 1 };
  if (e.state === "charge") {
    const k = clamp(e.st / (FOLIANT.shoveWind * windup * 0.6));
    return {
      near: mixPt(REST.near, [-6, -26], k),
      far: mixPt(REST.far, [5, -20], k),
      drop: 1 * k,
      stride: 0,
      open: 0,
      glow: 0,
    };
  }
  if (e.state === "lunge") return { near: [21, -22], far: [2, -18], drop: 0, stride: 0, open: 0, glow: 0 };
  if (e.state === "recover" && unbound(e)) {
    const k = clamp(e.st / 0.25);
    const end = clamp((e.st - (e.ay - 0.4)) / 0.4);
    const sag = Math.sin(time * 4) * 0.5;
    return {
      near: mixPt([14, -4], [12, -8 + sag], k),
      far: mixPt([6, -4], [-10, -8 + sag], k),
      drop: 3 * (1 - end) + sag,
      stride: 0,
      open: 1 - end,
      glow: 0,
    };
  }
  if (e.state === "recover") return { near: [13, -17], far: [-9, -15], drop: 0.5, stride: 0, open: 0, glow: 0 };
  const moving = Math.abs(e.vx) > 2;
  const step = moving ? Math.sin(time * 4.5) : 0;
  return {
    near: [REST.near[0] - step * 2, REST.near[1] + Math.abs(step) * 0.5],
    far: [REST.far[0] + step * 2, REST.far[1] + Math.abs(step) * 0.5],
    drop: moving ? Math.abs(Math.cos(time * 4.5)) * 0.8 : Math.sin(time * 2) * 0.3,
    stride: step,
    open: 0,
    glow: 0,
  };
}
