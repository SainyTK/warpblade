import { circle, hairline } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawMoon, fadeOut, grade, rankOf } from "./parts";

const RADIUS = [10, 14, 19, 26] as const;
const PUFFS = [4, 6, 9, 13] as const;
const DEPTH = 0.3;

export const CLOUD: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const open = ease.outCubic(Math.min(1, progress * 2.6));
  const radius = RADIUS[rank] * grade(cast) * open;
  const alpha = fadeOut(progress, fade);
  fineRing(0, 0, radius, radius * DEPTH, R[4], alpha);
  const n = PUFFS[rank];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + progress * 1.5;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius * DEPTH;
    const r = 1.2 + rank * 0.5 + (i % 2) * 0.6;
    circle(x, y - r * 0.4, r, R[2], alpha * 0.85);
    circle(x - r * 0.3, y - r * 0.7, r * 0.6, R[4], alpha * 0.85);
  }
  if (rank >= 1) {
    for (let i = 0; i < 4 + rank * 2; i++) {
      const a = (i / (4 + rank * 2)) * TAU;
      kit.motif(
        Math.cos(a) * radius * 0.8,
        Math.sin(a) * radius * DEPTH,
        -Math.PI / 2,
        3 + rank * 1.5,
        alpha * 0.7,
        rank,
      );
    }
  }
  if (rank >= 2) {
    const lift = ease.outCubic(smooth(0.1, 0.5, progress));
    fineRing(0, -26 * lift, radius * 0.5, radius * 0.5 * DEPTH, R[5], alpha * 0.8);
    drawMoon(kit, 0, -6, radius * 0.8, 2 + rank, alpha * 0.8 * lift);
  }
  if (rank >= 3) {
    fineRing(0, 0, radius * 1.4, radius * 1.4 * DEPTH, R[3], alpha * 0.7);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      hairline(Math.cos(a) * radius * 1.4, Math.sin(a) * radius * 1.4 * DEPTH, 0, -radius * 1.6, R[3], alpha * 0.35);
    }
  }
};
