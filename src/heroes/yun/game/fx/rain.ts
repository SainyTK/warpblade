import { hairline } from "../../../../engine/frame";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, rankOf } from "./parts";

const COUNT = [1, 3, 5, 9] as const;
const LENGTH = [11, 13, 16, 20] as const;
const DROP = [36, 48, 64, 90] as const;
const SPREAD = [0, 10, 16, 24] as const;
const LEANS = [0, -1, 1, -0.5, 0.5, -1.5, 1.5, -2, 2] as const;
const DOWN = Math.PI / 2;

export const RAIN: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const n = COUNT[rank];
  const length = LENGTH[rank] * grade(cast);
  const drop = DROP[rank] * grade(cast);
  const spread = cast.fillsScreen ? 60 : SPREAD[rank];
  const alpha = fadeOut(progress, fade, 0.75);
  const waves = rank >= 3 ? 2 : 1;
  for (let w = 0; w < waves; w++) {
    for (let i = 0; i < n; i++) {
      const start = (i * 0.05 + w * 0.22) * (rank >= 1 ? 1 : 0);
      const fall = ease.outCubic(smooth(start, start + 0.28, progress));
      if (fall <= 0) continue;
      const lean = LEANS[i % LEANS.length];
      const landX = lean * spread * 0.5 * (w ? 1.4 : 1);
      const fromX = rank >= 2 ? landX - lean * 14 : landX;
      const x = fromX + (landX - fromX) * fall;
      const y = -drop * (1 - fall);
      const angle = rank >= 2 ? Math.atan2(drop, landX - fromX) : DOWN;
      if (rank >= 1 && fall < 1) kit.motif(x, y - length - 2, angle + Math.PI, 3 + rank * 1.5, alpha * 0.7, rank);
      if (fall < 1) hairline(x, y - length - drop * 0.4, x, y - length, R[3], alpha * 0.4);
      drawFxSword(
        kit,
        x - Math.cos(angle) * length,
        y - Math.sin(angle) * length + length * 0.3 * fall,
        angle,
        length,
        alpha,
      );
      if (rank >= 1 && fall >= 1) {
        hairline(landX - 4 - rank, 0.5, landX + 4 + rank, 0.5, R[4], alpha * 0.8);
        if (rank >= 2) kit.motif(landX, 0, -Math.PI / 2 + lean * 0.3, 3 + rank, alpha * 0.6, rank);
      }
    }
  }
};
