import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawMoon, fadeOut, grade, rankOf } from "./parts";

const TRAVEL = [24, 36, 52, 76] as const;
const TALL = [8, 11, 15, 20] as const;
const NESTED = [1, 1, 2, 3] as const;

export const CRESCENTS: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const travel = TRAVEL[rank] * grade(cast);
  const tall = TALL[rank] * grade(cast);
  const thick = 1.6 + rank;
  const go = ease.outCubic(smooth(0, 0.8, progress));
  const alpha = fadeOut(progress, fade);
  const head = 4 + travel * go;
  for (let k = 0; k < NESTED[rank]; k++) {
    drawMoon(kit, head - k * (thick + 3), 0, tall * (1 - k * 0.18), thick * (1 - k * 0.15), alpha * (1 - k * 0.2));
  }
  if (rank >= 1) {
    for (let i = 0; i < 2 + rank * 2; i++) {
      const y = (i % 2 ? -1 : 1) * tall * (0.25 + 0.12 * i);
      kit.motif(head - thick - 3 - i * 3, y, Math.PI, 2 + rank, alpha * 0.75, rank);
    }
  }
  if (rank >= 3) {
    const split = ease.outCubic(smooth(0.3, 0.9, progress));
    for (const s of [-1, 1]) {
      drawMoon(kit, head + 6 * split, s * tall * 1.1 * split, tall * 0.55, thick * 0.6, alpha * split);
    }
  }
};
