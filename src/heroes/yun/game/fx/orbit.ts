import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, TAU } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, rankOf } from "./parts";

const COUNT = [1, 2, 3, 5] as const;
const RADIUS = [11, 14, 17, 20] as const;
const LENGTH = [10, 11, 13, 15] as const;
const DEPTH = 0.4;

export const ORBIT: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const radius = RADIUS[rank] * grade(cast) * ease.outCubic(Math.min(1, progress * 3));
  const length = LENGTH[rank] * grade(cast);
  const alpha = fadeOut(progress, fade);
  const rings = rank >= 3 ? 2 : 1;
  for (let r = 0; r < rings; r++) {
    const rr = radius * (r ? 1.5 : 1);
    const spin = progress * 7 * (r ? -0.7 : 1);
    const n = COUNT[rank] + r * 2;
    if (rank >= 1) fineRing(0, 0, rr, rr * DEPTH, R[r ? 3 : 4], alpha * 0.75);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + spin;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr * DEPTH;
      const tangent = a + (Math.PI / 2) * (r ? -1 : 1);
      const back = Math.sin(a) < 0 ? 0.7 : 1;
      if (rank >= 2) kit.motif(x, y, tangent + Math.PI, 3 + rank, alpha * 0.6 * back, rank);
      drawFxSword(
        kit,
        x - Math.cos(tangent) * length * 0.5,
        y - Math.sin(tangent) * length * 0.5 * DEPTH,
        tangent,
        length,
        alpha * back,
      );
    }
  }
};
