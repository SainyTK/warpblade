import type { Vec } from "../types/rig";

type Span = [Vec, Vec, Vec];

interface Section {
  center: Vec;
  normal: Vec;
  left: number;
  right: number;
}

const EPSILON = 0.0001;

function knot(points: readonly Vec[], index: number): Vec {
  const last = points.length - 1;
  if (index < 0) {
    return [2 * points[0][0] - points[1][0], 2 * points[0][1] - points[1][1]];
  }
  if (index > last) {
    return [2 * points[last][0] - points[last - 1][0], 2 * points[last][1] - points[last - 1][1]];
  }
  return points[index];
}

export function sampleTrail(points: readonly Vec[], phase: number): Vec {
  const distance = phase * (points.length - 1);
  const i = Math.max(0, Math.min(points.length - 1, Math.round(distance)));
  const t = distance - i + 0.5;
  const a = knot(points, i - 1);
  const b = points[i];
  const c = knot(points, i + 1);
  const aw = 0.5 * (1 - t) ** 2;
  const cw = 0.5 * t ** 2;
  const bw = 1 - aw - cw;
  return [aw * a[0] + bw * b[0] + cw * c[0], aw * a[1] + bw * b[1] + cw * c[1]];
}

const difference = (a: Vec, b: Vec): Vec => [b[0] - a[0], b[1] - a[1]];
const cross = (a: Vec, b: Vec): number => a[0] * b[1] - a[1] * b[0];

function chordNormal(a: Vec, b: Vec): Vec {
  const [dx, dy] = difference(a, b);
  const length = Math.hypot(dx, dy) || 1;
  return [dy / length, -dx / length];
}

function section(centers: readonly Vec[], halfWidths: Vec, index: number): Section {
  const center = centers[index];
  const start = centers[index - 1] ?? center;
  const end = centers[index + 1] ?? center;
  const before = chordNormal(start, center);
  const after = chordNormal(center, end);
  const dx = before[0] + after[0];
  const dy = before[1] + after[1];
  const length = Math.hypot(dx, dy);
  if (length < EPSILON) {
    return { center, normal: before, left: 0, right: 0 };
  }
  return { center, normal: [dx / length, dy / length], left: halfWidths[0], right: halfWidths[1] };
}

export function shapeTrail(centers: readonly Vec[], halfWidths: readonly Vec[]): Span[] {
  const sections = centers.map((_, index) => section(centers, halfWidths[index], index));
  for (let i = 1; i < sections.length; i++) {
    const a = sections[i - 1];
    const b = sections[i];
    const delta = difference(a.center, b.center);
    const turn = cross(a.normal, b.normal);
    if (turn > EPSILON) {
      b.left = Math.min(b.left, (0.9 * Math.max(0, cross(a.normal, delta))) / turn);
    }
    if (turn < -EPSILON) {
      a.right = Math.min(a.right, (0.9 * Math.max(0, cross(b.normal, delta))) / -turn);
    }
  }
  return sections.map(({ center: [x, y], normal: [dx, dy], left, right }) => [
    [x - dx * left, y - dy * left],
    [x, y],
    [x + dx * right, y + dy * right],
  ]);
}
