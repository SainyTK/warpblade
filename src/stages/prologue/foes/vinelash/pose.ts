import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { VINE } from "./constants";
import { windTime } from "./moves";

export type Pt = [number, number];

const LINKS = 14;
const whip: Pt[] = Array.from({ length: LINKS }, () => [0, 0]);

export interface VinePose {
  whip: readonly Pt[];
  bloom: number;
  hunch: number;
  crack: number;
}

const pose: VinePose = { whip, bloom: 0, hunch: 0, crack: 0 };

function bezier(a: Pt, c: Pt, b: Pt): void {
  for (let i = 0; i < LINKS; i++) {
    const u = i / (LINKS - 1);
    const v = 1 - u;
    whip[i][0] = v * v * a[0] + 2 * v * u * c[0] + u * u * b[0];
    whip[i][1] = v * v * a[1] + 2 * v * u * c[1] + u * u * b[1];
  }
}

function coiled(k: number, time: number): void {
  const center: Pt = [-8, -24];
  const radius = 5.5;
  for (let i = 0; i < LINKS; i++) {
    const u = i / (LINKS - 1);
    const hang = [whip[i][0], whip[i][1]] as const;
    let x: number;
    let y: number;
    if (u < 0.35) {
      const v = u / 0.35;
      const w = 1 - v;
      x = w * w * VINE.shoulderX + 2 * w * v * 4 + v * v * center[0];
      y = w * w * VINE.shoulderY + 2 * w * v * -30 + v * v * (center[1] - radius);
    } else {
      const v = (u - 0.35) / 0.65;
      const a = -Math.PI / 2 - v * Math.PI * 1.7;
      const r = radius * (1 - v * 0.55);
      x = center[0] + Math.cos(a) * r;
      y = center[1] + Math.sin(a) * r + Math.sin(time * 16 + v * 5) * 0.3;
    }
    whip[i][0] = lerp(hang[0], x, k);
    whip[i][1] = lerp(hang[1], y, k);
  }
}

function hanging(time: number, by: number): void {
  const sway = Math.sin(time * 2.4) * 1.5;
  bezier([VINE.shoulderX, VINE.shoulderY + by], [17 + sway, -14 + by], [13 + sway * 0.6, -1]);
}

function lashOut(st: number): void {
  const k = ease.outCubic(clamp(st / VINE.snap));
  const span = (VINE.reach - VINE.shoulderX) * k;
  for (let i = 0; i < LINKS; i++) {
    const u = i / (LINKS - 1);
    const ripple = Math.sin(u * Math.PI * 3 - st * 60) * (1 - k) * 3;
    whip[i][0] = VINE.shoulderX + span * u;
    whip[i][1] = lerp(VINE.shoulderY, -9, Math.min(1, u * 3)) + ripple;
  }
}

function lying(st: number): void {
  const pull = clamp(st / VINE.lie);
  const tip = lerp(VINE.reach - 2, 14, ease.outQuad(pull));
  for (let i = 0; i < LINKS; i++) {
    const u = i / (LINKS - 1);
    whip[i][0] = lerp(VINE.shoulderX, tip, u);
    whip[i][1] = lerp(VINE.shoulderY, -1, Math.min(1, u * 3.5)) - Math.sin(u * 9 + st * 3) * 0.3;
  }
}

export function vinePose(e: Enemy, t: number): VinePose {
  const time = t + e.seed;
  pose.bloom = 0;
  pose.crack = 0;
  pose.hunch = 0;
  const hurt = e.stun > 0 || e.stagger > 0 || e.air;
  if (!hurt && e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / windTime()));
    pose.bloom = k;
    pose.hunch = -k * 1.5;
    hanging(time, 0);
    coiled(k, time);
    return pose;
  }
  if (!hurt && e.state === "lunge") {
    pose.bloom = 1;
    pose.hunch = 1.5;
    pose.crack = e.st >= VINE.snap && e.st < VINE.snap + 0.08 ? 1 : 0;
    lashOut(e.st);
    return pose;
  }
  if (!hurt && e.state === "recover") {
    pose.bloom = clamp(1 - e.st / (VINE.lie * 0.6));
    pose.hunch = 1;
    lying(e.st);
    return pose;
  }
  hanging(time, 0);
  return pose;
}
