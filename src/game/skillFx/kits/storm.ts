import { ELEMENT_FX } from "../../../constants/skillFx";
import { circle, glowLine, hairline, line, sparkle } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { ElementKit } from "../../../types/skillFx";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { fxRng, particles } from "../../state";

const look = ELEMENT_FX.storm;
const R = look.ramp;
const KINKS = 4;

export function fork(x0: number, y0: number, x1: number, y1: number, jag: number, seed: number, alpha: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= KINKS; i++) {
    const u = i / KINKS;
    const off = i === KINKS ? 0 : (grain(i, seed) - 0.5) * 2 * jag;
    const qx = x0 + dx * u + nx * off;
    const qy = y0 + dy * u + ny * off;
    if (i <= KINKS / 2) line(px, py, qx, qy, R[3], alpha);
    else hairline(px, py, qx, qy, R[3], alpha);
    hairline(px, py - 0.5, qx, qy - 0.5, i <= KINKS / 2 ? R[5] : R[4], alpha);
    px = qx;
    py = qy;
  }
  glowLine(x0, y0, x1, y1, Math.max(3, jag * 1.4), R[3], 0.15 * alpha);
}

export const STORM_KIT: ElementKit = {
  look,
  motif(x, y, angle, length, alpha, rank) {
    const seed = Math.floor(x * 13 + y * 7);
    const tx = x + Math.cos(angle) * length;
    const ty = y + Math.sin(angle) * length;
    fork(x, y, tx, ty, length * 0.22, seed, alpha);
    if (rank >= 2) {
      const mx = x + Math.cos(angle) * length * 0.5;
      const my = y + Math.sin(angle) * length * 0.5;
      const b = angle + (grain(seed, 3) > 0.5 ? 0.7 : -0.7);
      fork(mx, my, mx + Math.cos(b) * length * 0.5, my + Math.sin(b) * length * 0.5, length * 0.12, seed + 9, alpha);
    }
  },
  core(x, y, radius, alpha, rank) {
    circle(x, y, radius + 0.5, R[2], alpha);
    circle(x, y, radius, R[3], alpha);
    circle(x, y, radius * 0.45, R[5], alpha);
    const rays = rank >= 2 ? 6 : 4;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * TAU + 0.3;
      fork(x, y, x + Math.cos(a) * radius * 2.4, y + Math.sin(a) * radius * 2.4, radius * 0.5, i * 31 + rank, alpha);
    }
    sparkle(x, y, radius + 2, R[4], R[3], 0.3 * alpha);
  },
  spray(x, y, count, speed, angle, spread) {
    for (let i = 0; i < count; i++) {
      const a = angle + fxRng.range(-spread, spread);
      const s = fxRng.range(0.5, 1.2) * speed;
      particles.spawn(PK.SPARK, x, y, Math.cos(a) * s, Math.sin(a) * s - 30, fxRng.range(0.15, 0.4), {
        sparks: look.sparks,
      });
    }
  },
  linger(x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      particles.spawn(
        PK.STAR,
        x + fxRng.range(-spread, spread),
        y - fxRng.range(0, spread),
        fxRng.range(-8, 8),
        -fxRng.range(4, 18),
        fxRng.range(0.4, 0.9),
        { col: R[4], size: fxRng.range(0.6, 2.2), delay: fxRng.range(0, 0.25) },
      );
    }
  },
};
