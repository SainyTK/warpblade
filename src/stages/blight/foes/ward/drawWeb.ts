import { fleck, glow, hairline } from "../../../../engine/frame";
import { BLIGHT } from "../../colors";

const KNOTS = 8;

export function drawWardWeb(cx: number, cy: number, rx: number, ry: number, t: number, k: number): void {
  const spin = t * 0.6;
  const pts: [number, number][] = [];
  for (let i = 0; i < KNOTS; i++) {
    const a = spin + (i / KNOTS) * Math.PI * 2;
    const wob = 1 + Math.sin(t * 3 + i * 1.7) * 0.08;
    pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]);
  }
  for (let i = 0; i < KNOTS; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % KNOTS];
    const [dx, dy] = pts[(i + 3) % KNOTS];
    const shimmer = 0.35 + 0.3 * Math.sin(t * 6 + i);
    hairline(ax, ay, bx, by, BLIGHT.fungus[3], k * shimmer);
    hairline(ax, ay, dx, dy, BLIGHT.fungus[2], k * shimmer * 0.45);
    fleck(ax, ay, BLIGHT.fungus[4], k * 0.8);
  }
  const run = (t * 0.9) % 1;
  const lead = Math.floor(run * KNOTS);
  const [sx, sy] = pts[lead];
  fleck(sx, sy, BLIGHT.bone[3], k);
  glow(cx, cy, Math.max(rx, ry) + 4, BLIGHT.fungus[2], 0.16 * k);
}

export function drawWardThread(x0: number, y0: number, x1: number, y1: number, t: number, k: number): void {
  const pieces = 10;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= pieces; i++) {
    const u = i / pieces;
    const sag = Math.sin(u * Math.PI) * 6;
    const nx = x0 + (x1 - x0) * u;
    const ny = y0 + (y1 - y0) * u + sag + Math.sin(t * 9 + u * 8) * 0.8;
    hairline(px, py, nx, ny, BLIGHT.fungus[3], k);
    px = nx;
    py = ny;
  }
  const run = (t * 2.2) % 1;
  fleck(x0 + (x1 - x0) * run, y0 + (y1 - y0) * run + Math.sin(run * Math.PI) * 6, BLIGHT.fungus[4], k);
}
