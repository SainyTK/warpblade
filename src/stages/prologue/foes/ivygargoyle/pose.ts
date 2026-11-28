import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { grounded } from "./armour";
import { GARGOYLE } from "./constants";
import { foldTime } from "./moves";

export interface GargoylePose {
  wing: number;
  span: number;
  tilt: number;
  bob: number;
  heat: number;
  open: number;
  jaw: number;
}

const pose: GargoylePose = { wing: 0, span: 1, tilt: 0, bob: 0, heat: 0, open: 0, jaw: 0 };
const UP = -1.75;
const DOWN = -3.55;

export function gargoylePose(e: Enemy, time: number): GargoylePose {
  Object.assign(pose, { span: 1, tilt: 0, bob: 0, heat: 0.2, open: 0, jaw: 0 });
  if (grounded(e) || e.state === "recover") {
    const left = clamp(e.ay / GARGOYLE.grounded);
    pose.wing = -3.45;
    pose.span = 1;
    pose.open = clamp(left * 3);
    pose.heat = 0.6 + Math.sin(time * 9) * 0.2;
    pose.jaw = 0.6;
    pose.bob = Math.sin(time * 4) * 0.3;
    return pose;
  }
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / foldTime()));
    pose.wing = lerp(UP, -1.45, k);
    pose.span = lerp(1, 0.62, k);
    pose.heat = 0.2 + k * 0.8;
    pose.jaw = k;
    pose.tilt = -k * 0.15;
    return pose;
  }
  if (e.state === "dive") {
    pose.wing = -1.3;
    pose.span = 0.55;
    pose.heat = 1;
    pose.jaw = 1;
    pose.tilt = 0.5;
    return pose;
  }
  const beat = (Math.sin(time * 4.6) + 1) / 2;
  const flap = beat ** 1.6;
  pose.wing = lerp(UP, DOWN, flap);
  pose.bob = -flap * 1.6 + 0.8;
  if (e.state === "hop") pose.open = clamp(1 - e.st / GARGOYLE.takeoff);
  return pose;
}
