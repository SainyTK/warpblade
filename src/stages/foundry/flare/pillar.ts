import { fleck, glow, glowLine, hairline, place, px } from "../../../engine/frame";
import { surfaceBelow } from "../../../game/world";
import type { ElementImpact } from "../../../types/drill";
import { grain } from "../../../utils/grain";
import { clamp, ease } from "../../../utils/math";
import { FORGE } from "../colors";

const M = FORGE.molten;
const C = FORGE.crust;
const TIMES = { crack: 0.07, rise: 0.13, hold: 0.22, end: 0.38 } as const;
const BLOBS = 7;
const SPARKS = 10;

function heightAt(age: number, tall: number): number {
  if (age < TIMES.crack) return 0;
  if (age < TIMES.rise) return tall * ease.outCubic((age - TIMES.crack) / (TIMES.rise - TIMES.crack));
  if (age < TIMES.hold) return tall;
  return tall * (1 - clamp((age - TIMES.hold) / (TIMES.end - TIMES.hold)) * 0.75);
}

function crack(x: number, y: number, reach: number, k: number): void {
  for (let i = -3; i <= 3; i++) {
    const a = x + (i / 3) * reach;
    const b = x + ((i + 1) / 3) * reach;
    if (i === 3) break;
    const jag = (grain(i + 5, Math.floor(x)) - 0.5) * 1.5;
    hairline(a, y + jag * 0.4, b, y - jag * 0.4, k > 0.6 ? M[4] : M[2], 0.5 + k * 0.5);
  }
  glow(x, y, reach + 4, M[2], 0.3 * k);
}

function column(x: number, y: number, half: number, h: number, age: number): void {
  for (let v = 0; v < h; v += 0.5) {
    const u = v / h;
    const sway = Math.sin(age * 40 + v * 0.5) * 0.7 * u;
    const w = half * (1 - u * 0.35) + Math.sin(v * 0.9 + age * 30) * 0.4;
    const cx = x + sway;
    hairline(cx - w, y - v, cx + w, y - v, M[2]);
    hairline(cx - w * 0.7, y - v, cx + w * 0.7, y - v, M[3]);
    hairline(cx - w * 0.38, y - v, cx + w * 0.38, y - v, u > 0.85 ? M[4] : M[5]);
    if ((v + Math.floor(age * 60)) % 5 === 0) hairline(cx - w, y - v, cx - w * 0.6, y - v, M[4]);
  }
  for (let i = 0; i < 3; i++) {
    const r = half * (1 - i * 0.3);
    hairline(x - r, y - h - i, x + r, y - h - i, i === 2 ? M[5] : M[3]);
  }
  glowLine(x, y, x, y - h, half * 2 + 8, M[2], 0.5);
}

function blobs(x: number, y: number, tall: number, age: number): void {
  const u = clamp((age - TIMES.hold) / (TIMES.end - TIMES.hold));
  for (let i = 0; i < BLOBS; i++) {
    const dir = (grain(i, 1) - 0.5) * 2;
    const bx = x + dir * 26 * u;
    const by = y - tall * (0.7 + grain(i, 2) * 0.3) + 140 * u * u - 30 * u;
    if (by > y) continue;
    px(bx, by, u < 0.6 ? M[4] : M[2]);
    fleck(bx - 0.25, by - 0.25, M[5], 1 - u);
  }
}

function sparks(x: number, y: number, tall: number, age: number): void {
  for (let i = 0; i < SPARKS; i++) {
    const a = grain(i, 7) * Math.PI;
    const speed = 30 + grain(i, 8) * 60;
    const life = clamp((age - TIMES.crack) * 2.5);
    const sx = x + Math.cos(a) * speed * life * (grain(i, 9) > 0.5 ? 1 : -1);
    const sy = y - tall * 0.3 * grain(i, 10) - Math.sin(a) * speed * life + 90 * life * life;
    fleck(sx, sy, i % 3 ? M[4] : M[5], 1 - life);
  }
}

function crust(x: number, y: number, half: number, age: number): void {
  const k = clamp((age - TIMES.hold) / (TIMES.end - TIMES.hold));
  const w = half * 1.6;
  for (let dx = -w; dx <= w; dx += 0.5) {
    const hump = Math.max(0, 1 - (dx / w) ** 2) * (2 + half * 0.25) * k;
    if (hump < 0.5) continue;
    hairline(x + dx, y, x + dx, y - hump, C[2]);
    fleck(x + dx, y - hump, C[3]);
  }
  hairline(x - w * 0.5, y - 1, x + w * 0.2, y - 1.5, M[3], k);
  fleck(x + w * 0.3, y - 1, M[4], k);
}

export function drawForgeFlareImpact(impact: ElementImpact): void {
  const { x, age, spell, fromSword } = impact;
  place();
  const y = surfaceBelow(x, impact.y - 4);
  const scale = fromSword ? 0.55 : 1;
  const half = (3 + spell.radius * 0.12) * scale;
  const tall = Math.max((22 + spell.radius * 1.2) * scale, y - impact.y + 10);
  crack(x, y, half * 2.4, clamp(age / TIMES.crack));
  const h = heightAt(age, tall);
  if (h >= 1) column(x, y, half, h, age);
  if (age > TIMES.hold) blobs(x, y, tall, age);
  if (age > TIMES.crack) sparks(x, y, tall, age);
  crust(x, y, half, age);
  glow(x, y - h * 0.5, 18 + half * 2, M[3], 0.55 * (1 - clamp((age - TIMES.hold) / 0.2)));
}
