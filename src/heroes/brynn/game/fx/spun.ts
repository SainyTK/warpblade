import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { smooth, TAU } from "../../../../utils/math";
import { drawGreatsword } from "./blade";

const LENGTH = [12, 16, 20, 26] as const;
const BLADES = [1, 1, 2, 4] as const;

export const SPUN: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const length = LENGTH[rank] * (1 + cast.gradeInTier * 0.3);
  const turn = progress * (3 + rank) * TAU * 0.5;
  const alpha = fade * (1 - smooth(0.7, 1, progress));
  const n = BLADES[rank];
  for (let i = 0; i < n; i++) {
    const a = turn + (i / n) * TAU;
    drawGreatsword(kit, -Math.cos(a) * length * 0.5, -Math.sin(a) * length * 0.5 * 0.7, a, length, alpha);
    if (rank >= 1) {
      const back = a - 0.5;
      drawGreatsword(kit, -Math.cos(back) * length * 0.5, -Math.sin(back) * length * 0.35, back, length, alpha * 0.35);
    }
  }
  if (rank >= 2) fineRing(0, 0, length * 0.6, length * 0.42, R[4], alpha * 0.7);
  if (rank >= 3) fineRing(0, 0, length * 0.75, length * 0.52, R[3], alpha * 0.6);
};
