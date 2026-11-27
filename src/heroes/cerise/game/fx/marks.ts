import { hairline, line, polygon } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { Ramp } from "../../../../types/color";
import { TAU } from "../../../../utils/math";
import { ROSE_RAMP } from "../../look/rose";

export function drawRapier(x: number, y: number, length: number, angle: number, edge: Ramp, a: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const at = (d: number, w = 0) => [x + c * d - n * w, y + n * d + c * w] as const;
  const guard = length * 0.22;
  line(...at(-guard), ...at(length * 0.55), edge[3], a);
  hairline(...at(length * 0.55), ...at(length), edge[4], a);
  hairline(...at(-guard * 0.6, -0.5), ...at(length * 0.9, -0.5), ROSE_RAMP[5], a * 0.8);
  line(...at(-guard, -2), ...at(-guard, 2), ROSE_RAMP[4], a);
  hairline(...at(-guard - 1, -2.5), ...at(-guard + 1, 2.5), ROSE_RAMP[3], a);
  line(...at(-guard - 1), ...at(-guard - 4), ROSE_RAMP[1], a);
  line(...at(-guard - 4.5), ...at(-guard - 4.5), ROSE_RAMP[2], a);
}

export function drawPoint(x: number, y: number, r: number, a: number): void {
  polygon(
    [
      [x, y - r],
      [x + r * 0.7, y],
      [x, y + r],
      [x - r * 0.7, y],
    ],
    ROSE_RAMP[3],
    a,
  );
  hairline(x, y - r, x, y + r * 0.4, ROSE_RAMP[5], a);
}

export function drawPointArc(x: number, y: number, radius: number, count: number, spin: number, a: number): void {
  for (let i = 0; i < count; i++) {
    const g = -Math.PI / 2 + ((i - (count - 1) / 2) / Math.max(1, count - 1)) * 2.2 + Math.sin(spin) * 0.15;
    drawPoint(x + Math.cos(g) * radius, y + Math.sin(g) * radius * 0.8, 1.6, a);
  }
}

export function drawRose(x: number, y: number, r: number, spin: number, petals: Ramp, a: number): void {
  const n = 5;
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU + spin;
    const tip = [x + Math.cos(g) * r, y + Math.sin(g) * r] as const;
    const left = [x + Math.cos(g - 0.55) * r * 0.55, y + Math.sin(g - 0.55) * r * 0.55] as const;
    const right = [x + Math.cos(g + 0.55) * r * 0.55, y + Math.sin(g + 0.55) * r * 0.55] as const;
    polygon([[x, y], left, tip, right], petals[2], a * 0.85);
    hairline(x, y, ...tip, petals[4], a * 0.7);
  }
  fineRing(x, y, r * 0.42, r * 0.42, petals[4], a, 0);
  line(x, y, x, y, ROSE_RAMP[2], a);
}
