import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";

const RINGS = [1, 2, 3, 4] as const;
const REACH = [12, 18, 26, 36] as const;
const HEAD = -24;

export const ROAR: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const reach = REACH[rank] * (1 + cast.gradeInTier * 0.3);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  for (let i = 0; i < RINGS[rank]; i++) {
    const u = ease.outCubic(smooth(i * 0.1, 0.7 + i * 0.1, progress));
    if (u <= 0) continue;
    const r = 3 + reach * u;
    fineRing(0, HEAD, r * 0.6, r * 0.7, i % 2 ? R[3] : R[4], alpha * (1 - u * 0.5), 0);
  }
  if (rank >= 1) {
    const n = 4 + rank * 2;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * Math.PI * 1.4;
      const r = reach * ease.outCubic(Math.min(1, progress * 2));
      kit.motif(Math.cos(a) * r * 0.5, HEAD + Math.sin(a) * r * 0.6, a, 2 + rank * 1.5, alpha, rank);
    }
  }
};
