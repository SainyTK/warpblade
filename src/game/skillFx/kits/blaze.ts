import { ELEMENT_FX, FX_BUDGET } from "../../../constants/skillFx";
import { circle, glow, hairline, polygon } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { ElementKit } from "../../../types/skillFx";
import { fxRng, particles } from "../../state";

const look = ELEMENT_FX.blaze;
const R = look.ramp;
const UP = -Math.PI / 2;

function tongue(x: number, y: number, angle: number, length: number, width: number, c: number, alpha: number): void {
  const a = angle * 0.4 + UP * 0.6;
  const cx = Math.cos(a);
  const cy = Math.sin(a);
  const nx = -cy;
  const ny = cx;
  polygon(
    [
      [x + nx * width, y + ny * width],
      [x + cx * length * 0.55 + nx * width * 0.6, y + cy * length * 0.55 + ny * width * 0.6],
      [x + cx * length, y + cy * length],
      [x + cx * length * 0.5 - nx * width * 0.4, y + cy * length * 0.5 - ny * width * 0.4],
      [x - nx * width, y - ny * width],
    ],
    c,
    alpha,
  );
}

export const BLAZE_KIT: ElementKit = {
  look,
  motif(x, y, angle, length, alpha, rank) {
    const w = Math.max(1, length * 0.32);
    tongue(x, y, angle, length, w, R[2], alpha);
    tongue(x, y, angle, length * 0.72, w * 0.62, R[3], alpha);
    tongue(x, y, angle, length * 0.42, w * 0.34, R[4], alpha);
    if (rank >= 2) {
      const a = angle * 0.4 + UP * 0.6;
      hairline(x, y, x + Math.cos(a) * length * 1.1, y + Math.sin(a) * length * 1.1, R[5], alpha * 0.7);
    }
    if (alpha >= FX_BUDGET.glowFrom) glow(x, y - length * 0.4, length + 2, R[3], 0.12 * alpha);
  },
  core(x, y, radius, alpha, rank) {
    circle(x, y, radius + 1, R[1], alpha);
    circle(x, y, radius, R[3], alpha);
    circle(x - radius * 0.15, y - radius * 0.2, radius * 0.66, R[4], alpha);
    circle(x - radius * 0.2, y - radius * 0.3, radius * (0.24 + 0.04 * rank), R[5], alpha);
    glow(x, y, radius * 3 + 4, R[3], 0.25 * alpha);
  },
  spray(x, y, count, speed, angle, spread) {
    for (let i = 0; i < count; i++) {
      const a = angle + fxRng.range(-spread, spread);
      const s = fxRng.range(0.35, 1) * speed;
      particles.spawn(PK.FIRE, x, y, Math.cos(a) * s, Math.sin(a) * s - 20, fxRng.range(0.25, 0.5), {
        col: 0,
        size: fxRng.range(1.4, 2.8),
      });
    }
  },
  linger(x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      particles.spawn(
        PK.EMBER,
        x + fxRng.range(-spread, spread),
        y + fxRng.range(-spread * 0.4, 2),
        fxRng.range(-14, 14),
        -fxRng.range(14, 40),
        fxRng.range(0.7, 1.4),
        { sparks: look.sparks, size: fxRng.range(0.6, 1.4), delay: fxRng.range(0, 0.25) },
      );
    }
  },
};
