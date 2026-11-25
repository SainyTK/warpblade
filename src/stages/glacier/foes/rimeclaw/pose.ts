import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { CLAW_TIMES } from "./constants";

export type Pt = readonly [number, number];

export interface ClawPose {
  lift: number;
  pitch: number;
  haunch: number;
  head: Pt;
  jaw: number;
  frontNear: Pt;
  frontFar: Pt;
  hindNear: Pt;
  hindFar: Pt;
  tailMid: Pt;
  tailTip: Pt;
  glare: boolean;
  tailGlow: boolean;
  spines: number;
  spineGlow: number;
  mouthGlow: number;
}

const BASE: ClawPose = {
  lift: 0,
  pitch: 0,
  haunch: 0,
  head: [31, -31],
  jaw: 0,
  frontNear: [17, 0],
  frontFar: [11, 0],
  hindNear: [-14, 0],
  hindFar: [-21, 0],
  tailMid: [-38, -31],
  tailTip: [-47, -24],
  glare: false,
  tailGlow: false,
  spines: 0,
  spineGlow: 0,
  mouthGlow: 0,
};

function walking(time: number): Partial<ClawPose> {
  const gait = Math.floor(time * 5) % 4;
  const step = [3, 1, -3, -1][gait];
  const up = gait % 2 ? -1 : 0;
  return {
    lift: gait % 2 ? -0.5 : 0,
    frontNear: [17 + step, up],
    frontFar: [11 - step, 0],
    hindNear: [-14 - step, 0],
    hindFar: [-21 + step, up],
    tailTip: [-47, -24 + Math.sin(time * 3) * 2],
  };
}

function stance(e: Enemy, time: number): Partial<ClawPose> {
  const u = clamp(e.st / 0.7);
  const lash = Math.sin(time * 18);
  switch (e.state) {
    case "charge":
      return {
        lift: 7,
        pitch: 3,
        haunch: -3 + Math.sin(time * 22) * 1,
        head: [33, -24],
        frontNear: [23, 0],
        frontFar: [18, 0],
        hindNear: [-17, 0],
        hindFar: [-23, 0],
        tailMid: [-40, -34],
        tailTip: [-48, -40 + lash * 4],
        glare: true,
      };
    case "leap":
      return {
        lift: -4,
        pitch: e.vy < 0 ? -3 : 2,
        head: [35, -33],
        frontNear: [38, -12],
        frontFar: [34, -8],
        hindNear: [-36, -10],
        hindFar: [-40, -6],
        tailMid: [-44, -30],
        tailTip: [-58, -30],
        glare: true,
        jaw: 0.6,
      };
    case "wind":
      return {
        lift: 3,
        head: [30, -29],
        tailMid: [-34, -46 - u * 4],
        tailTip: [-26, -58 - u * 4],
        tailGlow: true,
        glare: true,
      };
    case "swipe":
      return { lift: 2, head: [31, -29], tailMid: [-46, -12], tailTip: [-60, -3], tailGlow: true };
    case "volley":
      return { pitch: -6, head: [27, -43], jaw: 0.3, frontNear: [19, -5], glare: true };
    case "shoot":
      return { pitch: -2, head: [34, -35], jaw: 1, glare: true };
    case "hop":
      return { lift: 3, pitch: 5, head: [35, -21], jaw: 0.35, mouthGlow: u, glare: true };
    case "beam":
      return { lift: 3, pitch: 5, head: [37, -20], jaw: 0.9, mouthGlow: 1 };
    case "blink":
      return { lift: 2, pitch: 1, haunch: -1, spineGlow: clamp(e.st / CLAW_TIMES.ringWind), glare: true };
    case "dive":
      return { spineGlow: 1 - clamp(e.st / CLAW_TIMES.ring) };
    case "summon":
      return { pitch: -7, head: [26, -45], jaw: 1, frontNear: [20, -6], glare: true, spineGlow: 1 };
    case "recover":
      return { lift: 1, head: [31, -29], jaw: 0.3 + Math.sin(time * 8) * 0.15 };
    default:
      return walking(time);
  }
}

export function clawPose(e: Enemy, time: number): ClawPose {
  const pose = { ...BASE, ...stance(e, time) };
  if (e.phase === 2) {
    pose.spines = e.state === "summon" ? clamp(e.st / CLAW_TIMES.shift) : 1;
    pose.spineGlow = Math.max(pose.spineGlow, 0.25 + Math.sin(time * 4) * 0.15);
  }
  return pose;
}
