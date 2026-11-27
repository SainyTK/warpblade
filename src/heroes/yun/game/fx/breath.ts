import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawArc, drawFxSword, fadeOut, grade, rankOf } from "./parts";

const RADIUS = [10, 14, 18, 24] as const;
const SWORDS = [1, 2, 4, 6] as const;
const DEPTH = 0.3;

export const BREATH: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const open = ease.outCubic(Math.min(1, progress * 2.5));
  const radius = RADIUS[rank] * grade(cast) * open;
  const alpha = fadeOut(progress, fade);
  fineRing(0, 0, radius, radius * DEPTH, R[4], alpha);
  drawArc(0, -0.5, radius * 0.8, radius * 0.8 * DEPTH, 0, Math.PI, R[5], alpha * 0.8);
  const n = SWORDS[rank];
  const rise = ease.outCubic(smooth(0.05, 0.5, progress));
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : -radius * 0.6 + (radius * 1.2 * i) / (n - 1);
    const lift = 8 + rise * (10 + (i % 2) * 4);
    const angle = rank >= 3 ? -0.2 : -Math.PI / 2;
    const length = 11 + rank;
    drawFxSword(kit, x, -lift + length * 0.5, angle, length, alpha);
  }
  if (rank >= 1) {
    for (let i = 0; i < 3 + rank * 2; i++) {
      const u = i / (2 + rank * 2) - 0.5;
      kit.motif(u * radius * 2, 0, -Math.PI / 2, 3 + rank * 1.5, alpha * 0.7 * open, rank);
    }
  }
  if (rank >= 2) fineRing(0, 0, radius * 1.35, radius * 1.35 * DEPTH, R[3], alpha * 0.7);
};
