import type { Vec } from "../../types/rig";
import type { Rect } from "./atlas";

type Triangle = readonly [Vec, Vec, Vec];

const SEAM_OVERLAP = 0.35;
const MIN_AREA = 0.0001;

function expandedCorner(prev: Vec, point: Vec, next: Vec, winding: number): Vec {
  const prevLength = Math.hypot(point[0] - prev[0], point[1] - prev[1]);
  const nextLength = Math.hypot(next[0] - point[0], next[1] - point[1]);
  const ax = (point[1] - prev[1]) / prevLength;
  const ay = (prev[0] - point[0]) / prevLength;
  const bx = (next[1] - point[1]) / nextLength;
  const by = (point[0] - next[0]) / nextLength;
  const reach = (winding * SEAM_OVERLAP) / Math.max(0.25, 1 + ax * bx + ay * by);
  return [point[0] + reach * (ax + bx), point[1] + reach * (ay + by)];
}

export function paintTriangle(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  rect: Rect,
  [s0, s1, s2]: Triangle,
  [p0, p1, p2]: Triangle,
): void {
  const sx = s1[0] - s0[0];
  const sy = s1[1] - s0[1];
  const tx = s2[0] - s0[0];
  const ty = s2[1] - s0[1];
  const ux = p1[0] - p0[0];
  const uy = p1[1] - p0[1];
  const vx = p2[0] - p0[0];
  const vy = p2[1] - p0[1];
  const bindArea = sx * ty - sy * tx;
  const posedArea = ux * vy - uy * vx;
  if (Math.abs(bindArea) < MIN_AREA || Math.abs(posedArea) < MIN_AREA) {
    return;
  }
  const a = (ux * ty - vx * sy) / bindArea;
  const b = (uy * ty - vy * sy) / bindArea;
  const c = (vx * sx - ux * tx) / bindArea;
  const d = (vy * sx - uy * tx) / bindArea;
  const winding = Math.sign(posedArea);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(...expandedCorner(p2, p0, p1, winding));
  ctx.lineTo(...expandedCorner(p0, p1, p2, winding));
  ctx.lineTo(...expandedCorner(p1, p2, p0, winding));
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, p0[0] - a * s0[0] - c * s0[1], p0[1] - b * s0[0] - d * s0[1]);
  ctx.drawImage(image, ...rect, 0, 0, rect[2], rect[3]);
  ctx.restore();
}
