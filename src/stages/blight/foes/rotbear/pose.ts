import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BEAR_TIMES } from "./constants";

export type Pt = readonly [number, number];

export interface BearPose {
  hip: Pt;
  shoulder: Pt;
  head: Pt;
  tilt: number;
  jaw: number;
  frontNear: Pt;
  frontFar: Pt;
  hindNear: Pt;
  hindFar: Pt;
  sac: number;
  glare: boolean;
  stalks: number;
}

const FOURS: BearPose = {
  hip: [-11, -17],
  shoulder: [7, -19],
  head: [18, -18],
  tilt: 0.25,
  jaw: 0.1,
  frontNear: [13, 0],
  frontFar: [8, 0],
  hindNear: [-9, 0],
  hindFar: [-15, 0],
  sac: 0.2,
  glare: false,
  stalks: 0.2,
};

const REARED: BearPose = {
  hip: [-7, -15],
  shoulder: [-1, -30],
  head: [9, -33],
  tilt: -0.1,
  jaw: 0.8,
  frontNear: [15, -47],
  frontFar: [9, -50],
  hindNear: [-3, 0],
  hindFar: [-10, 0],
  sac: 1,
  glare: true,
  stalks: 1,
};

const SLAMMED: BearPose = {
  hip: [-9, -19],
  shoulder: [9, -14],
  head: [22, -11],
  tilt: 0.45,
  jaw: 0.8,
  frontNear: [22, 0],
  frontFar: [18, 0],
  hindNear: [-6, 0],
  hindFar: [-13, 0],
  sac: 1,
  glare: true,
  stalks: 0.6,
};

const SLUMPED: BearPose = {
  hip: [-11, -15],
  shoulder: [6, -14],
  head: [18, -8],
  tilt: 0.6,
  jaw: 0.35,
  frontNear: [15, 0],
  frontFar: [10, 0],
  hindNear: [-8, 0],
  hindFar: [-15, 0],
  sac: 1,
  glare: false,
  stalks: 0.1,
};

const HOWL: BearPose = {
  ...FOURS,
  hip: [-12, -17],
  shoulder: [5, -22],
  head: [12, -28],
  tilt: -0.7,
  jaw: 1.2,
  sac: 0.6,
  glare: true,
  stalks: 1,
};

const mixPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

function mix(a: BearPose, b: BearPose, k: number): BearPose {
  return {
    hip: mixPt(a.hip, b.hip, k),
    shoulder: mixPt(a.shoulder, b.shoulder, k),
    head: mixPt(a.head, b.head, k),
    tilt: lerp(a.tilt, b.tilt, k),
    jaw: lerp(a.jaw, b.jaw, k),
    frontNear: mixPt(a.frontNear, b.frontNear, k),
    frontFar: mixPt(a.frontFar, b.frontFar, k),
    hindNear: mixPt(a.hindNear, b.hindNear, k),
    hindFar: mixPt(a.hindFar, b.hindFar, k),
    sac: lerp(a.sac, b.sac, k),
    glare: k > 0.5 ? b.glare : a.glare,
    stalks: lerp(a.stalks, b.stalks, k),
  };
}

const nudge = (p: Pt, dx: number, dy: number): Pt => [p[0] + dx, p[1] + dy];

function walking(e: Enemy, time: number): BearPose {
  const moving = Math.abs(e.vx) > 3;
  const breathe = Math.sin(time * 2) * 0.5;
  if (!moving) return { ...FOURS, shoulder: nudge(FOURS.shoulder, 0, breathe), head: nudge(FOURS.head, 0, breathe) };
  const gait = Math.floor(time * 3.4) % 4;
  const step = [2.5, 1, -2.5, -1][gait];
  const up = gait % 2 ? -1.5 : 0;
  const sway = gait % 2 ? -0.5 : 0;
  return {
    ...FOURS,
    hip: nudge(FOURS.hip, 0, sway),
    shoulder: nudge(FOURS.shoulder, 0, -sway),
    head: nudge(FOURS.head, 0, -sway + breathe),
    frontNear: [FOURS.frontNear[0] + step, up],
    frontFar: [FOURS.frontFar[0] - step, 0],
    hindNear: [FOURS.hindNear[0] - step, 0],
    hindFar: [FOURS.hindFar[0] + step, up],
  };
}

const SIZE = 1.15;

const grow = (q: Pt): Pt => [q[0] * SIZE, q[1] * SIZE];

function sized(p: BearPose): BearPose {
  return {
    ...p,
    hip: grow(p.hip),
    shoulder: grow(p.shoulder),
    head: grow(p.head),
    frontNear: grow(p.frontNear),
    frontFar: grow(p.frontFar),
    hindNear: grow(p.hindNear),
    hindFar: grow(p.hindFar),
  };
}

export const bearPose = (e: Enemy, time: number): BearPose => sized(stance(e, time));

function stance(e: Enemy, time: number): BearPose {
  const windup = waveScale(game.wave).windup;
  const shiver = Math.sin(time * 40) * 0.4;
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / (BEAR_TIMES.rear * windup)));
    const p = mix(FOURS, REARED, k);
    return { ...p, shoulder: nudge(p.shoulder, shiver * k, 0), sac: k * (0.8 + Math.sin(time * 20) * 0.2) };
  }
  if (e.state === "swipe") return mix(SLAMMED, SLUMPED, clamp(e.st / BEAR_TIMES.slam) * 0.3);
  if (e.state === "recover" && e.n === 1) {
    const k = clamp((e.st - BEAR_TIMES.slump + 0.35) / 0.35);
    const p = mix(SLUMPED, FOURS, k);
    return {
      ...p,
      sac: (1 - k) * (0.75 + Math.sin(time * 9) * 0.25),
      head: nudge(p.head, 0, Math.sin(time * 5) * 0.5),
    };
  }
  if (e.state === "charge") {
    const k = ease.outCubic(clamp(e.st / (BEAR_TIMES.howl * windup)));
    const p = mix(FOURS, HOWL, k);
    return { ...p, jaw: k * 0.6, head: nudge(p.head, shiver * k, 0) };
  }
  if (e.state === "shoot") {
    const k = clamp(e.st / BEAR_TIMES.roar);
    const p = mix(HOWL, FOURS, k * k * k);
    return {
      ...p,
      head: nudge(p.head, 3 * (1 - k) + shiver, 3 * (1 - k)),
      tilt: lerp(-0.1, FOURS.tilt, k),
      jaw: lerp(1.3, 0.2, k),
    };
  }
  if (e.state === "recover") return mix(HOWL, FOURS, clamp(e.st / BEAR_TIMES.rest));
  return walking(e, time);
}
