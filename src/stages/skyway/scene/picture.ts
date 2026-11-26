import { FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color, Ramp } from "../../../types/color";
import { clamp } from "../../../utils/math";

export const SKY_ROWS = GROUND * RES;

export interface Billow {
  x: number;
  y: number;
  r: number;
}

export const newPicture = (): Uint32Array => new Uint32Array(FW * SKY_ROWS);

export function rampDither(ramp: Ramp, k: number, ix: number, iy: number): Color {
  const v = clamp(k) * (ramp.length - 1);
  const i = Math.floor(v);
  return ramp[Math.min(ramp.length - 1, v - i > bayerAt(ix, iy) ? i + 1 : i)];
}

export interface Field {
  f: number;
  gx: number;
  gy: number;
}

const field: Field = { f: 0, gx: 0, gy: 0 };
const FALLOFF = 2.4;

export function fieldAt(billows: readonly Billow[], x: number, y: number): Field {
  field.f = 0;
  field.gx = 0;
  field.gy = 0;
  for (const b of billows) {
    const dx = x - b.x;
    const dy = y - b.y;
    const reach = b.r * 1.6;
    if (dx > reach || dx < -reach || dy > reach || dy < -reach) continue;
    const r2 = b.r * b.r;
    const e = Math.exp(-((dx * dx + dy * dy) / r2) * FALLOFF);
    field.f += e;
    const k = (-2 * FALLOFF * e) / r2;
    field.gx += k * dx;
    field.gy += k * dy;
  }
  return field;
}

const LIGHT = { x: 0.6, y: -0.8 } as const;

export function cloudLight(h: Field, edge: number): number {
  const len = Math.hypot(h.gx, h.gy);
  if (len < 1e-6) return 0.5;
  const steep = Math.min(1, len * edge);
  return clamp(0.5 - ((h.gx * LIGHT.x + h.gy * LIGHT.y) / len) * 0.5 * steep);
}
