import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, TAU } from "../../../utils/math";
import { SCENE } from "./palette";

export const CLOCK = { x: 82, y: 44, r: 31 } as const;

const RIM = { outer: 1, bezel: 0.86, ring: 0.8, chapter: 0.62, chapterWidth: 0.025 } as const;
const LIGHT = { x: 0.6, y: -0.8 } as const;
const HANDS = [
  { angle: -2.3, length: 0.5, width: 0.07 },
  { angle: 0.95, length: 0.74, width: 0.045 },
] as const;
const CRACK: readonly (readonly [number, number])[] = [
  [0.18, -0.74],
  [0.26, -0.5],
  [0.2, -0.34],
  [0.32, -0.12],
  [0.28, 0.04],
];
const B = SCENE.brass;

function handCover(nx: number, ny: number): boolean {
  for (const h of HANDS) {
    const dx = Math.cos(h.angle);
    const dy = Math.sin(h.angle);
    const along = nx * dx + ny * dy;
    if (along < -0.08 || along > h.length) continue;
    const across = Math.abs(nx * dy - ny * dx);
    const taper = along > h.length * 0.75 ? (h.length - along) / (h.length * 0.25) : 1;
    const bulb = Math.abs(along - h.length * 0.7) < 0.05 ? 1.8 : 1;
    if (across < h.width * taper * bulb) return true;
  }
  return false;
}

function onCrack(nx: number, ny: number): boolean {
  for (let i = 1; i < CRACK.length; i++) {
    const [ax, ay] = CRACK[i - 1];
    const [bx, by] = CRACK[i];
    const vx = bx - ax;
    const vy = by - ay;
    const t = clamp(((nx - ax) * vx + (ny - ay) * vy) / (vx * vx + vy * vy));
    if (Math.hypot(nx - ax - vx * t, ny - ay - vy * t) < 0.012) return true;
  }
  return false;
}

export function clockAt(x: number, y: number): Color {
  const nx = (x - CLOCK.x) / CLOCK.r;
  const ny = (y - CLOCK.y) / CLOCK.r;
  const d = Math.hypot(nx, ny);
  if (d > RIM.outer) return 0;
  const lit = d > 0 ? (nx * LIGHT.x + ny * LIGHT.y) / d : 0;
  if (d > RIM.bezel) {
    const band = (d - RIM.bezel) / (RIM.outer - RIM.bezel);
    const tone = clamp(0.5 + lit * 0.4 - Math.abs(band - 0.5) * 0.6);
    const notch = Math.floor((Math.atan2(ny, nx) / TAU) * 48 + 48) % 2 === 0 && band > 0.7;
    return notch ? B[1] : B[Math.min(4, Math.floor(tone * 4.99))];
  }
  if (d > RIM.ring) return scale(B[1], 0.7 + 0.3 * clamp(-lit));
  if (handCover(nx, ny)) return d < 0.1 ? B[3] : B[0];
  if (d < 0.08) return d < 0.05 ? B[4] : B[2];
  const angle = Math.atan2(ny, nx);
  const hour = ((angle / TAU) * 12 + 12) % 1;
  const nearTick = Math.min(hour, 1 - hour);
  const quarter = Math.round(((angle / TAU) * 12 + 12) % 12) % 3 === 0;
  let c = mix(SCENE.clockFaceDim, SCENE.clockFace, clamp(0.55 - ny * 0.4 + nx * 0.2));
  c = scale(c, 0.94 + grain(Math.floor(x * 4), Math.floor(y * 4)) * 0.08);
  if (d > RIM.ring - 0.12 && nearTick < (quarter ? 0.09 : 0.04)) c = B[0];
  if (d > RIM.ring - 0.06 && d < RIM.ring - 0.04) c = scale(c, 0.6);
  if (Math.abs(d - RIM.chapter) < RIM.chapterWidth) c = scale(c, 0.55);
  const minute = ((angle / TAU) * 60 + 60) % 1 < 0.15;
  if (minute && d > 0.5 && d < RIM.chapter - 0.05) c = scale(c, 0.75);
  if (onCrack(nx, ny)) c = SCENE.causticHot;
  return c;
}
