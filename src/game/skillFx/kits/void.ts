import { ELEMENT_FX } from "../../../constants/skillFx";
import { circle, fleck, glow, hairline, polygon, sparkle } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { ElementKit } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { fineRing } from "../../effects/fine";
import { fxRng, particles } from "../../state";

const look = ELEMENT_FX.void;
const R = look.ramp;

function tear(x: number, y: number, angle: number, length: number, width: number, alpha: number): void {
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  const nx = -cy;
  const ny = cx;
  const mx = x + cx * length * 0.5;
  const my = y + cy * length * 0.5;
  const tx = x + cx * length;
  const ty = y + cy * length;
  polygon(
    [
      [x, y],
      [mx + nx * width, my + ny * width],
      [tx, ty],
      [mx - nx * width, my - ny * width],
    ],
    look.dark,
    alpha,
  );
  hairline(x, y, mx + nx * width, my + ny * width, R[4], alpha);
  hairline(mx + nx * width, my + ny * width, tx, ty, R[3], alpha);
  hairline(x, y, mx - nx * width, my - ny * width, R[3], alpha);
  hairline(mx - nx * width, my - ny * width, tx, ty, R[4], alpha);
}

export const VOID_KIT: ElementKit = {
  look,
  motif(x, y, angle, length, alpha, rank) {
    tear(x, y, angle, length, Math.max(1, length * 0.18), alpha);
    if (rank >= 1) fleck(x + Math.cos(angle) * length * 0.5, y + Math.sin(angle) * length * 0.5, WHITE, alpha);
    if (rank >= 2) {
      const tx = x + Math.cos(angle) * (length + 2);
      const ty = y + Math.sin(angle) * (length + 2);
      sparkle(tx, ty, 2 + rank, WHITE, R[4], 0.35 * alpha);
    }
    glow(x, y, length * 0.6 + 2, R[2], 0.11 * alpha);
  },
  core(x, y, radius, alpha, rank) {
    circle(x, y, radius + 1.5, R[3], alpha);
    circle(x, y, radius + 0.5, R[1], alpha);
    circle(x, y, radius, look.dark, alpha);
    fineRing(x, y, radius + 2, radius + 2, R[4], alpha);
    if (rank >= 2) fineRing(x, y, radius + 4, radius + 4, R[2], alpha * 0.7);
    for (let i = 0; i < 4 + rank * 2; i++) {
      const a = (i / (4 + rank * 2)) * TAU;
      fleck(x + Math.cos(a) * radius * 0.5, y + Math.sin(a) * radius * 0.5, R[4], alpha);
    }
    glow(x, y, radius * 3 + 4, R[2], 0.25 * alpha);
  },
  spray(x, y, count, speed, angle, spread) {
    for (let i = 0; i < count; i++) {
      const a = angle + fxRng.range(-spread, spread);
      const s = fxRng.range(0.4, 1) * speed;
      particles.spawn(PK.MOTE, x, y, Math.cos(a) * s, Math.sin(a) * s, fxRng.range(0.25, 0.5), {
        col: fxRng.pick(R.slice(2, 5)),
        size: fxRng.range(0.8, 1.3),
      });
    }
  },
  linger(x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      particles.spawn(
        PK.STAR,
        x + fxRng.range(-spread, spread),
        y - fxRng.range(0, spread),
        fxRng.range(-6, 6),
        -fxRng.range(2, 10),
        fxRng.range(0.5, 1.1),
        { col: R[4], size: fxRng.range(0.6, 1.8), delay: fxRng.range(0, 0.3) },
      );
    }
  },
};
