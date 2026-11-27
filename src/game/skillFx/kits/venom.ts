import { ELEMENT_FX, FX_BUDGET } from "../../../constants/skillFx";
import { circle, disc, fleck, glow, hairline, line } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { ElementKit } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { fxRng, particles } from "../../state";

const look = ELEMENT_FX.venom;
const R = look.ramp;

function bubble(x: number, y: number, r: number, alpha: number): void {
  circle(x, y, r + 0.5, R[1], alpha);
  circle(x, y, r, R[3], alpha);
  circle(x - r * 0.25, y - r * 0.25, r * 0.5, R[4], alpha);
  fleck(x - r * 0.45, y - r * 0.5, WHITE, alpha);
}

function tendril(x: number, y: number, angle: number, length: number, alpha: number, seed: number): void {
  let px = x;
  let py = y;
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const curl = Math.sin(u * 3.2 + seed) * length * 0.18;
    const qx = x + Math.cos(angle) * length * u - Math.sin(angle) * curl;
    const qy = y + Math.sin(angle) * length * u + Math.cos(angle) * curl;
    if (u < 0.6) line(px, py, qx, qy, R[2], alpha);
    hairline(px, py, qx, qy, u < 0.6 ? R[4] : R[3], alpha);
    px = qx;
    py = qy;
  }
}

export const VENOM_KIT: ElementKit = {
  look,
  motif(x, y, angle, length, alpha, rank) {
    const seed = grain(Math.floor(x), Math.floor(y)) * TAU;
    tendril(x, y, angle, length, alpha, seed);
    bubble(x + Math.cos(angle) * length, y + Math.sin(angle) * length, Math.max(1, length * 0.16), alpha);
    if (rank >= 2) {
      tendril(x, y, angle + 0.6, length * 0.7, alpha * 0.8, seed + 2);
      hairline(x, y, x, y + length * 0.4, R[2], alpha * 0.7);
    }
    if (alpha >= FX_BUDGET.glowFrom) glow(x, y, length * 0.7 + 2, R[3], 0.1 * alpha);
  },
  core(x, y, radius, alpha, rank) {
    disc(x, y, radius * 1.6, R[0], 0.55 * alpha);
    bubble(x, y, radius, alpha);
    const n = rank >= 2 ? 6 : 3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + 0.4;
      bubble(x + Math.cos(a) * radius * 1.3, y + Math.sin(a) * radius * 1.3, radius * 0.35, alpha);
    }
    glow(x, y, radius * 3 + 4, R[3], 0.12 * alpha);
  },
  spray(x, y, count, speed, angle, spread) {
    for (let i = 0; i < count; i++) {
      const a = angle + fxRng.range(-spread, spread);
      const s = fxRng.range(0.4, 1) * speed;
      particles.spawn(PK.MOTE, x, y, Math.cos(a) * s, Math.sin(a) * s, fxRng.range(0.3, 0.6), {
        col: fxRng.pick(R.slice(2, 5)),
        size: fxRng.range(0.8, 1.4),
      });
    }
  },
  linger(x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      particles.spawn(
        PK.VAPOUR,
        x + fxRng.range(-spread, spread),
        y - fxRng.range(0, spread * 0.5),
        fxRng.range(-6, 6),
        -fxRng.range(4, 14),
        fxRng.range(0.8, 1.5),
        { col: R[2], size: fxRng.range(2, 4), delay: fxRng.range(0, 0.25) },
      );
    }
  },
};
