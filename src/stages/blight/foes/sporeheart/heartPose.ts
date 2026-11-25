import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp, smooth } from "../../../../utils/math";
import { HEART_TIMES, type HeartMove, MOVE_STATE, STRIKE_STATE } from "./moves";

export type Pt = readonly [number, number];

export interface ArmPose {
  elbow: Pt;
  hand: Pt;
}

export interface HeartPose {
  back: ArmPose;
  front: ArmPose;
  beat: number;
  sacs: number;
  open: number;
  core: number;
  eyes: number;
  hideArms: boolean;
  sink: number;
}

const arm = (ex: number, ey: number, hx: number, hy: number): ArmPose => ({ elbow: [ex, ey], hand: [hx, hy] });

const IDLE = { back: arm(-21, -30, -26, -13), front: arm(21, -31, 28, -15) };

const WIND_POSE: Record<HeartMove, { back: ArmPose; front: ArmPose }> = {
  lash: { back: arm(-22, -34, -28, -20), front: arm(14, -58, -2, -68) },
  bomb: { back: arm(-17, -50, -8, -55), front: arm(17, -51, 8, -57) },
  root: { back: arm(-24, -54, -28, -66), front: arm(24, -55, 28, -68) },
  summon: { back: arm(-28, -44, -38, -52), front: arm(28, -45, 38, -54) },
  sweep: { back: arm(-18, -22, -4, -18), front: arm(18, -50, 4, -52) },
  pulse: { back: arm(-16, -26, 6, -30), front: arm(16, -42, -6, -40) },
};

const STRIKE_POSE: Record<HeartMove, { back: ArmPose; front: ArmPose }> = {
  lash: { back: arm(-22, -32, -30, -16), front: arm(26, -20, 40, -3) },
  bomb: { back: arm(-20, -56, -18, -68), front: arm(20, -58, 20, -70) },
  root: { back: arm(-26, -22, -32, 3), front: arm(26, -22, 32, 3) },
  summon: { back: arm(-30, -46, -40, -56), front: arm(30, -48, 40, -58) },
  sweep: IDLE,
  pulse: { back: arm(-30, -40, -42, -46), front: arm(30, -42, 42, -48) },
};

const mixArm = (a: ArmPose, b: ArmPose, k: number): ArmPose => ({
  elbow: [lerp(a.elbow[0], b.elbow[0], k), lerp(a.elbow[1], b.elbow[1], k)],
  hand: [lerp(a.hand[0], b.hand[0], k), lerp(a.hand[1], b.hand[1], k)],
});

const sway = (p: ArmPose, time: number, phase: number): ArmPose => ({
  elbow: [p.elbow[0] + Math.sin(time * 1.3 + phase) * 1.2, p.elbow[1] + Math.sin(time * 1.7 + phase) * 1],
  hand: [p.hand[0] + Math.sin(time * 1.3 + phase + 0.6) * 2, p.hand[1] + Math.sin(time * 1.9 + phase) * 1.4],
});

function moveIn(e: Enemy): { move: HeartMove; strike: boolean } | null {
  for (const m of Object.keys(MOVE_STATE) as HeartMove[]) {
    if (MOVE_STATE[m] === e.state) return { move: m, strike: false };
    if (STRIKE_STATE[m] === e.state) return { move: m, strike: true };
  }
  return null;
}

export function heartPose(e: Enemy, time: number, wind: (m: HeartMove) => number): HeartPose {
  const phase2 = e.phase === 2;
  const waking = e.state === "blink";
  const wakeK = waking ? clamp(e.st / HEART_TIMES.wake) : 1;
  const beatRate = phase2 ? 3.4 : 2.2;
  const beatWave = Math.max(0, Math.sin(time * beatRate * Math.PI)) ** 3;
  const pose: HeartPose = {
    back: sway(IDLE.back, time, 0),
    front: sway(IDLE.front, time, 2),
    beat: beatWave,
    sacs: 0,
    open: phase2 ? (waking ? clamp((wakeK - 0.45) / 0.3) : 1) : 0,
    core: phase2 ? 0.5 + beatWave * 0.3 : 0,
    eyes: 1,
    hideArms: false,
    sink: 0,
  };
  if (waking) {
    const thrash = Math.sin(time * 26) * (1 - wakeK);
    pose.back = arm(-24 + thrash * 4, -40 + thrash * 6, -34 + thrash * 8, -50 - thrash * 10);
    pose.front = arm(24 - thrash * 4, -42 - thrash * 6, 34 - thrash * 8, -52 + thrash * 10);
    pose.beat = Math.abs(Math.sin(time * 18));
    pose.eyes = 1.4;
    return pose;
  }
  const at = moveIn(e);
  if (!at) {
    if (e.state === "recover") pose.eyes = 0.6;
    return pose;
  }
  const { move, strike } = at;
  if (!strike) {
    const k = smooth(0, 1, clamp(e.st / wind(move)));
    pose.back = mixArm(pose.back, WIND_POSE[move].back, k);
    pose.front = mixArm(pose.front, WIND_POSE[move].front, k);
    pose.eyes = 1 + k * 0.5;
    if (move === "bomb") pose.sacs = k;
    if (move === "pulse") pose.core = phase2 ? 0.6 + k * 0.4 + Math.sin(time * 40) * 0.1 * k : 0;
    if (move === "pulse" || move === "sweep") pose.beat = Math.abs(Math.sin(time * (8 + k * 14)));
    if (move === "root") pose.sink = k;
    return pose;
  }
  const k = ease.outCubic(clamp(e.st / 0.12));
  pose.back = mixArm(WIND_POSE[move].back, STRIKE_POSE[move].back, k);
  pose.front = mixArm(WIND_POSE[move].front, STRIKE_POSE[move].front, k);
  pose.hideArms = move === "sweep";
  if (move === "pulse") pose.core = 1 - clamp(e.st / 0.6) * 0.5;
  if (move === "bomb") pose.sacs = 1 - k;
  return pose;
}
