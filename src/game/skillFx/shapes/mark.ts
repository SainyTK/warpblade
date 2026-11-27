import type { FxShapeDraw } from "../../../types/skillFx";
import { ease, TAU } from "../../../utils/math";
import { fineRing } from "../../effects/fine";

export const drawMark: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const r = (4 + rank * 2) * Math.sqrt(cast.size) * ease.outCubic(Math.min(1, progress * 3));
  fineRing(0, 0, r, r, R[4], fade);
  if (rank >= 1) fineRing(0, 0, r + 2, r + 2, R[2], fade * 0.7);
  const n = 3 + rank;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + progress * 2;
    kit.motif(Math.cos(a) * r, Math.sin(a) * r, a, 2 + rank, fade, rank);
  }
  if (rank >= 2) kit.core(0, 0, 1.5 + rank * 0.5, fade * (1 - progress), rank);
};
