import { ELEMENT_FX, FX_BUDGET } from "../../../constants/skillFx";
import { glow, hairline, polygon, sparkle } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { ElementKit } from "../../../types/skillFx";
import { TAU } from "../../../utils/math";
import { fxRng, particles } from "../../state";

const look = ELEMENT_FX.frost;
const R = look.ramp;

function shard(x: number, y: number, angle: number, length: number, width: number, alpha: number): void {
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  const nx = -cy;
  const ny = cx;
  const sx = x + cx * length * 0.3;
  const sy = y + cy * length * 0.3;
  const tx = x + cx * length;
  const ty = y + cy * length;
  polygon(
    [
      [x, y],
      [sx + nx * width, sy + ny * width],
      [tx, ty],
      [sx - nx * width, sy - ny * width],
    ],
    R[3],
    alpha,
  );
  polygon(
    [
      [x, y],
      [sx + nx * width * 0.9, sy + ny * width * 0.9],
      [tx, ty],
    ],
    R[4],
    alpha,
  );
  hairline(x, y, tx, ty, R[5], alpha);
  hairline(sx - nx * width, sy - ny * width, tx, ty, R[1], alpha * 0.8);
}

export const FROST_KIT: ElementKit = {
  look,
  motif(x, y, angle, length, alpha, rank) {
    shard(x, y, angle, length, Math.max(1, length * 0.24), alpha);
    if (rank >= 2) {
      shard(x, y, angle - 0.5, length * 0.55, Math.max(0.8, length * 0.14), alpha * 0.9);
      shard(x, y, angle + 0.5, length * 0.55, Math.max(0.8, length * 0.14), alpha * 0.9);
    }
    if (alpha >= FX_BUDGET.glowFrom)
      glow(x + Math.cos(angle) * length * 0.5, y + Math.sin(angle) * length * 0.5, length * 0.8 + 2, R[3], 0.1 * alpha);
  },
  core(x, y, radius, alpha, rank) {
    const arms = rank >= 2 ? 8 : 6;
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * TAU + Math.PI / arms;
      shard(x, y, a, radius * (i % 2 ? 1.1 : 1.6), Math.max(1, radius * 0.3), alpha);
    }
    sparkle(x, y, radius * 0.6 + 1, R[5], R[3], 0.3 * alpha);
    glow(x, y, radius * 3 + 4, R[3], 0.12 * alpha);
  },
  spray(x, y, count, speed, angle, spread) {
    for (let i = 0; i < count; i++) {
      const a = angle + fxRng.range(-spread, spread);
      const s = fxRng.range(0.4, 1) * speed;
      particles.spawn(PK.SHARD, x, y, Math.cos(a) * s, Math.sin(a) * s - 30, fxRng.range(0.35, 0.7), {
        col: fxRng.pick(R.slice(3)),
        size: fxRng.range(1.5, 3.2),
      });
    }
  },
  linger(x, y, count, spread) {
    for (let i = 0; i < count; i++) {
      particles.spawn(
        PK.FLAKE,
        x + fxRng.range(-spread, spread),
        y - fxRng.range(0, spread),
        fxRng.range(-10, 10),
        fxRng.range(-12, 4),
        fxRng.range(0.8, 1.6),
        { col: fxRng.pick(R.slice(3)), size: fxRng.range(1, 1.8), delay: fxRng.range(0, 0.3) },
      );
    }
  },
};
