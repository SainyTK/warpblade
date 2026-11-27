import { fleck, hairline, line } from "../../../../engine/frame";
import type { Color } from "../../../../types/color";
import { HOT_RAMP } from "../../constants/colors";

const BRASS_DARK = HOT_RAMP[1];
const BRASS = HOT_RAMP[3];
const BRASS_LIGHT = HOT_RAMP[5];
const CASING_GRAVITY = 260;

export function drawBullet(x: number, y: number, angle: number, length: number, tracer: Color, alpha: number): void {
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  hairline(x - cx * length * 4, y - cy * length * 4, x - cx * length, y - cy * length, tracer, (u) => alpha * u);
  line(x - cx * length, y - cy * length, x, y, BRASS, alpha);
  hairline(x - cx * length, y - cy * length - 0.5, x, y - 0.5, BRASS_LIGHT, alpha);
  fleck(x + cx * 0.5, y + cy * 0.5, BRASS_LIGHT, alpha);
  fleck(x - cx * length, y - cy * length, BRASS_DARK, alpha);
}

export function drawCasing(
  x: number,
  y: number,
  vx: number,
  vy: number,
  spin: number,
  time: number,
  alpha: number,
): void {
  const cx = x + vx * time;
  const cy = y + vy * time + 0.5 * CASING_GRAVITY * time * time;
  const a = spin * time;
  const dx = Math.cos(a) * 1.2;
  const dy = Math.sin(a) * 1.2;
  hairline(cx - dx, cy - dy, cx + dx, cy + dy, BRASS, alpha);
  hairline(cx - dx, cy - dy - 0.5, cx + dx, cy + dy - 0.5, BRASS_LIGHT, alpha);
  fleck(cx - dx, cy - dy, BRASS_DARK, alpha);
}

export function drawChamber(x: number, y: number, radius: number, turn: number, alpha: number, loaded: number): void {
  for (let i = 0; i < 6; i++) {
    const a = turn + (i / 6) * Math.PI * 2;
    const hx = x + Math.cos(a) * radius;
    const hy = y + Math.sin(a) * radius * 0.85;
    const full = i < loaded;
    fleck(hx, hy, full ? BRASS_LIGHT : BRASS_DARK, alpha);
    fleck(hx + 0.5, hy, full ? BRASS : BRASS_DARK, alpha);
    fleck(hx, hy + 0.5, BRASS_DARK, alpha);
  }
}
