import { W } from "../../../constants/stage";
import { disc, ellipseRing } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { grain } from "../../../utils/grain";
import { ease, smooth } from "../../../utils/math";

const TALL_BY_RANK = [8, 18, 30, 44] as const;
const COUNT_BY_RANK = [3, 5, 8, 11] as const;
const MIST = 5;

export const drawSpikes: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const count = COUNT_BY_RANK[rank];
  const reach = cast.fillsScreen ? W * 0.45 : (at.reach ?? 30) * (1 + rank * 0.35);
  const sides = rank >= 3 ? [1, -1] : [1];
  const sink = smooth(0.7, 1, progress);
  if (rank >= 1) {
    const ring = reach * ease.outCubic(Math.min(1, progress * 3));
    ellipseRing(0, 0, ring * 0.6, ring * 0.12, R[3], fade * (1 - progress), 1);
  }
  for (const side of sides) {
    for (let i = 0; i < count; i++) {
      const v = i / (count - 1);
      const grow = ease.outBack(smooth(v * 0.08, v * 0.08 + 0.08, progress));
      if (grow <= 0) continue;
      const x = side * (2 + v * reach) - (sides.length === 1 ? reach * 0.45 : 0);
      const crest = 1 - Math.abs(v - 0.55) * 0.9;
      const tall =
        TALL_BY_RANK[rank] *
        (1 + 0.3 * cast.gradeInTier) *
        (0.6 + 0.4 * crest) *
        (0.8 + 0.2 * grain(i, side)) *
        (1 - sink);
      const lean = (grain(i, 5) - 0.5) * 0.45 + side * 0.12;
      kit.motif(x, 1, -Math.PI / 2 + lean, tall * grow, fade, rank);
      if (rank >= 2 && i % 2 === 0) {
        kit.motif(x + side * 3, 1, -Math.PI / 2 + lean + side * 0.5, tall * 0.55 * grow, fade, rank);
      }
    }
  }
  if (rank >= 3) {
    for (let i = 0; i < MIST; i++) {
      const mx = (grain(i, 9) - 0.3) * reach * 1.6;
      const r = (8 + grain(i, 4) * 6) * smooth(0, 0.4, progress);
      disc(mx, -r * 0.4, r, R[4], 0.22 * fade * (1 - progress));
    }
  }
};
