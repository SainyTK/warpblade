import type { Vec } from "../types/rig";
import type { Box } from "../types/world";

const pointToBox = (x: number, y: number, [l, t, r, b]: Box): number =>
  Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b));

function segmentsCross(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
  const side = (p: Vec, q: Vec, r: Vec): number => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const d1 = side(c, d, a);
  const d2 = side(c, d, b);
  const d3 = side(a, b, c);
  const d4 = side(a, b, d);
  return d1 * d2 <= 0 && d3 * d4 <= 0 && (d1 !== 0 || d2 !== 0 || d3 !== 0 || d4 !== 0);
}

function pointToSegment(p: Vec, a: Vec, b: Vec): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - a[0] - dx * u, p[1] - a[1] - dy * u);
}

/** how far the segment from a to b comes from this box: 0 when it touches or passes through it */
export function segmentToBox(a: Vec, b: Vec, box: Box): number {
  const [l, t, r, btm] = box;
  if (pointToBox(a[0], a[1], box) === 0 || pointToBox(b[0], b[1], box) === 0) return 0;
  const corners: Vec[] = [
    [l, t],
    [r, t],
    [r, btm],
    [l, btm],
  ];
  const edges = corners.map((c, i): [Vec, Vec] => [c, corners[(i + 1) % 4]]);
  if (edges.some(([c, d]) => segmentsCross(a, b, c, d))) return 0;
  return Math.min(
    pointToBox(a[0], a[1], box),
    pointToBox(b[0], b[1], box),
    ...corners.map((c) => pointToSegment(c, a, b)),
  );
}
