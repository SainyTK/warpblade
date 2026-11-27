import { FX_BUDGET } from "../../../constants/skillFx";
import { glow, hairline, polygon } from "../../../engine/frame";
import type { Ramp } from "../../../types/color";

const STEPS = 14;

export interface Arc {
  cx: number;
  cy: number;
  radius: number;
  squash: number;
  from: number;
  to: number;
  width: number;
}

export function arcPoint({ cx, cy, radius, squash }: Arc, angle: number, out = 0): readonly [number, number] {
  return [cx + Math.cos(angle) * (radius + out), cy + Math.sin(angle) * (radius + out) * squash];
}

export function drawBand(arc: Arc, ramp: Ramp, alpha: number): void {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  const mid: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const u = i / STEPS;
    const a = arc.from + (arc.to - arc.from) * u;
    const w = arc.width * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.7;
    outer.push([...arcPoint(arc, a)]);
    inner.push([...arcPoint(arc, a, -w)]);
    mid.push([...arcPoint(arc, a, -w * 0.35)]);
  }
  polygon([...outer, ...inner.reverse()], ramp[2], alpha);
  polygon([...outer, ...mid.slice().reverse()], ramp[4], alpha);
  for (let i = 0; i < STEPS; i++) {
    hairline(outer[i][0], outer[i][1], outer[i + 1][0], outer[i + 1][1], ramp[5], alpha);
  }
  const [gx, gy] = arcPoint(arc, (arc.from + arc.to) / 2, -arc.width * 0.5);
  if (alpha >= FX_BUDGET.glowFrom) glow(gx, gy, arc.radius + arc.width, ramp[3], 0.21 * alpha);
}
