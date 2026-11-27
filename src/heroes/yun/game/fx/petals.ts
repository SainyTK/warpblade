import type { FxShapeDraw } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawArc, drawPetal, fadeOut, grade, rankOf } from "./parts";

export interface PetalLook {
  count: readonly [number, number, number, number];
  size: number;
  reach: number;
}

export function petals(look: PetalLook): FxShapeDraw {
  return (cast, _at, kit, progress, fade) => {
    const rank = rankOf(cast);
    const R = kit.look.ramp;
    const n = look.count[rank];
    const reach = look.reach * (1 + rank * 0.45) * grade(cast);
    const size = look.size * (1 + rank * 0.18);
    const out = ease.outCubic(Math.min(1, progress * 2.2));
    const alpha = fadeOut(progress, fade);
    const swirl = rank >= 2 ? progress * 2.2 : progress * 0.8;
    for (let i = 0; i < n; i++) {
      const g = grain(i, 13);
      const a = (i / n) * TAU * (rank >= 3 ? 1 : 0.5) - (rank >= 3 ? 0 : Math.PI * 0.6) + swirl * (0.6 + g);
      const r = reach * out * (0.45 + 0.55 * g);
      const sink = rank >= 3 ? progress * progress * reach * 0.8 : progress * 6;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.7 + sink;
      drawPetal(kit, x, y, a + progress * 6 * (g - 0.5), size, alpha);
    }
    if (rank >= 1) {
      drawArc(0, 0, reach * out, reach * out * 0.7, -Math.PI * 0.6 + swirl, swirl + Math.PI * 0.1, R[4], alpha * 0.8);
    }
    if (rank >= 2) {
      drawArc(
        0,
        0,
        reach * out * 0.6,
        reach * out * 0.42,
        Math.PI * 0.2 + swirl,
        swirl + Math.PI * 1.1,
        R[3],
        alpha * 0.7,
      );
      for (let i = 0; i < rank; i++)
        kit.motif(0, 0, -Math.PI * 0.4 + i * 1.3 + swirl, reach * 0.4 * out, alpha * 0.6, rank);
    }
    if (rank >= 3) {
      const fall = smooth(0.2, 1, progress);
      for (let i = 0; i < 10; i++) {
        const x = (grain(i, 31) - 0.5) * reach * 3;
        const y = -reach * 1.2 + fall * reach * 1.6 + grain(i, 7) * 8;
        drawPetal(kit, x, y, fall * 4 + i, size * 0.8, alpha * 0.85);
      }
    }
  };
}

export const PETALS = petals({ count: [5, 9, 14, 22], size: 2.6, reach: 14 });

export const LEAVES = petals({ count: [2, 4, 7, 12], size: 3.8, reach: 12 });
