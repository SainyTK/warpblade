import { hairline, line } from "../../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { fadeOut, grade, rankOf } from "./parts";

const TALL = [16, 22, 28, 34] as const;
const WIDE = [7, 9, 11, 14] as const;
const STEPS = 20;

function helix(kit: ElementKit, wide: number, tall: number, phase: number, flare: number, alpha: number): void {
  const R = kit.look.ramp;
  let prev: [number, number] | null = null;
  for (let i = 0; i <= STEPS; i++) {
    const u = i / STEPS;
    const a = u * TAU * 1.5 + phase;
    const r = wide * (1 + flare * u);
    const x = Math.cos(a) * r;
    const y = tall * 0.5 - u * tall - flare * u * tall * 0.5;
    const front = Math.sin(a) > 0;
    if (prev) {
      line(prev[0], prev[1], x, y, front ? R[3] : R[1], alpha * (front ? 1 : 0.6));
      line(prev[0], prev[1] + 1.5, x, y + 1.5, front ? R[2] : R[0], alpha * (front ? 1 : 0.6));
      if (front) hairline(prev[0], prev[1] - 0.5, x, y - 0.5, R[5], alpha);
    }
    prev = [x, y];
  }
}

export const RIBBON: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const tall = TALL[rank] * grade(cast);
  const wide = WIDE[rank] * grade(cast);
  const wrap = ease.outCubic(Math.min(1, progress * 2.5));
  const alpha = fadeOut(progress, fade);
  const phase = progress * 6;
  const flare = rank >= 3 ? ease.outCubic(smooth(0.25, 0.8, progress)) * 1.4 : 0;
  helix(kit, wide * wrap, tall, phase, flare, alpha);
  if (rank >= 1) {
    for (let i = 0; i < 2 + rank; i++) {
      const a = phase + i * 2.1;
      kit.motif(Math.cos(a) * wide, tall * 0.4 - (i / (2 + rank)) * tall, a, 2 + rank, alpha * 0.75, rank);
    }
  }
  if (rank >= 2) helix(kit, wide * wrap * 0.8, tall * 1.1, phase + Math.PI, flare, alpha * 0.85);
  if (rank >= 3) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + progress;
      kit.motif(0, 0, a, tall * 0.7 * flare, alpha * 0.8, rank);
    }
  }
};
