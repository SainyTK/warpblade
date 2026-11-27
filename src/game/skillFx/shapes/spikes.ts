import { W } from "../../../constants/stage";
import type { FxShapeDraw } from "../../../types/skillFx";
import { grain } from "../../../utils/grain";
import { ease, smooth } from "../../../utils/math";

export const drawSpikes: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const count = 3 + rank * 2;
  const reach = cast.fillsScreen ? W * 0.5 : (at.reach ?? 30) * cast.size;
  const sides = rank >= 3 ? [1, -1] : [1];
  for (const side of sides) {
    for (let i = 0; i < count; i++) {
      const v = i / Math.max(1, count - 1);
      const grow = ease.outBack(smooth(v * 0.22, v * 0.22 + 0.16, progress));
      if (grow <= 0) continue;
      const x = side * (4 + v * reach);
      const tall = (9 + rank * 4 + v * rank * 3) * cast.size * 0.7 * (0.7 + 0.3 * grain(i, side));
      const lean = (grain(i, 5) - 0.5) * 0.5 + (side > 0 ? 0.15 : -0.15);
      kit.motif(x, 1, -Math.PI / 2 + lean, tall * grow, fade, rank);
      if (rank >= 1 && i % 2 === 0) {
        kit.motif(x + side * 2, 1, -Math.PI / 2 + lean + 0.5, tall * 0.55 * grow, fade, rank);
      }
    }
  }
};
