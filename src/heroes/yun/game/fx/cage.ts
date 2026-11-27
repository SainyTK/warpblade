import { hairline } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, rankOf } from "./parts";

const COUNT = [3, 5, 7, 10] as const;
const RADIUS = [9, 12, 15, 19] as const;
const LENGTH = [12, 15, 18, 22] as const;
const DEPTH = 0.32;
const DOWN = Math.PI / 2;

export const CAGE: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const n = COUNT[rank];
  const radius = RADIUS[rank] * grade(cast);
  const length = LENGTH[rank] * grade(cast);
  const alpha = fadeOut(progress, fade, 0.75);
  const rings = rank >= 3 ? 2 : 1;
  for (let r = 0; r < rings; r++) {
    const rr = radius * (r ? 1.55 : 1);
    const ll = length * (r ? 1.3 : 1);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + r * 0.3;
      const fall = ease.outCubic(smooth(i * 0.025 + r * 0.12, i * 0.025 + r * 0.12 + 0.2, progress));
      if (fall <= 0) continue;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr * DEPTH;
      const back = Math.sin(a) < 0 ? 0.75 : 1;
      drawFxSword(kit, x, y - ll - 30 * (1 - fall), DOWN, ll, alpha * back);
      if (rank >= 2 && fall >= 1) kit.motif(x, y - ll, -DOWN, 2 + rank, alpha * 0.6 * back, rank);
    }
    if (rank >= 1) fineRing(0, 0, rr, rr * DEPTH, R[4], alpha * smooth(0.15, 0.3, progress));
    if (rank >= 2) fineRing(0, -ll * 0.82, rr, rr * DEPTH, R[3], alpha * 0.8 * smooth(0.2, 0.35, progress));
  }
  if (rank >= 3) {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + progress * 2;
      hairline(Math.cos(a) * radius, -length * 0.82, 0, -length * 1.6, R[4], alpha * 0.6);
    }
  }
};
