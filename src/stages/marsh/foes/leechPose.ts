import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp, smooth } from "../../../utils/math";
import { buried, erupting, LEECH, latched, rearing, rearTime } from "./leechMoves";

export interface SpinePoint {
  x: number;
  y: number;
  r: number;
}

export interface LeechPose {
  spine: SpinePoint[];
  mouth: number;
  sink: number;
  limp: boolean;
}

const SEGMENTS = 11;
const spine: SpinePoint[] = Array.from({ length: SEGMENTS }, () => ({ x: 0, y: 0, r: 0 }));
const pose: LeechPose = { spine, mouth: 0, sink: 0, limp: false };

const girth = (u: number): number => 1.5 + 2.1 * Math.sin(Math.PI * (0.12 + 0.72 * u)) + (u > 0.85 ? 0.5 : 0);

function along(head: [number, number], tail: [number, number], arch: number, wave: number, time: number): void {
  for (let i = 0; i < SEGMENTS; i++) {
    const u = i / (SEGMENTS - 1);
    const r = girth(u);
    const ripple = Math.sin(time * 7 - u * 6) * wave;
    spine[i].x = lerp(tail[0], head[0], u);
    spine[i].y = lerp(tail[1], head[1], u) - Math.sin(Math.PI * u) * arch + ripple;
    spine[i].r = r;
  }
}

function curl(cx: number, cy: number, radius: number, from: number, to: number): void {
  for (let i = 0; i < SEGMENTS; i++) {
    const u = i / (SEGMENTS - 1);
    const a = lerp(from, to, u);
    spine[i].x = cx + Math.cos(a) * radius;
    spine[i].y = cy + Math.sin(a) * radius;
    spine[i].r = girth(u) * 0.9;
  }
}

export function leechPose(e: Enemy, t: number): LeechPose {
  const time = t + e.seed;
  pose.limp = e.stun > 0 || e.air;
  pose.mouth = 0;
  pose.sink = 0;
  if (pose.limp) {
    along([10, -2], [-11, -1.5], 0.5, 0, time);
    return pose;
  }
  if (e.state === "burrow" && e.st < LEECH.dive) {
    const k = smooth(0, LEECH.dive, e.st);
    along([lerp(10, 6, k), lerp(-3, 8, k)], [lerp(-11, 2, k), lerp(-2, -1, k)], lerp(3, 9, k), 0, time);
    pose.sink = k;
    return pose;
  }
  if (buried(e)) {
    pose.sink = 1;
    return pose;
  }
  if (erupting(e)) {
    const rise = ease.outCubic(clamp(e.st / 0.1));
    const fall = clamp((e.st - LEECH.eruptTo) / (LEECH.erupt - LEECH.eruptTo));
    const height = LEECH.eruptHeight * rise * (1 - fall * 0.75);
    const lean = 4 * rise + fall * 8;
    along([lean, -height], [0, 6], -2 * rise, 0.4, time);
    pose.mouth = clamp(1 - fall * 1.6);
    return pose;
  }
  if (latched(e)) {
    curl(-1, -1, 7, Math.PI * 0.9, Math.PI * 2.15);
    pose.mouth = 0.35 + Math.sin(time * 14) * 0.1;
    return pose;
  }
  if (rearing(e)) {
    const k = ease.outCubic(clamp(e.st / rearTime()));
    along([lerp(10, 5, k), lerp(-3, -14, k)], [lerp(-11, -12, k), -1.5], 1 + k * 2, 0.3 * k, time * 2);
    pose.mouth = k;
    return pose;
  }
  if (e.state === "lunge") {
    const k = clamp(e.st / LEECH.lunge);
    along([lerp(16, 12, k), lerp(-6, -3, k)], [-9, -1.5], 1, 0, time);
    pose.mouth = 1 - k * 0.6;
    return pose;
  }
  if (e.state === "recover") {
    along([11, -2], [-12, -1.5], 0.6, 0.25, time * 0.6);
    return pose;
  }
  const step = Math.sin(time * 3);
  const gather = Math.max(0, step);
  const reach = Math.max(0, -step);
  along([10 - gather * 3, -3], [-11 + reach * 3, -1.5], 2 + gather * 4, 0.3, time);
  return pose;
}
