import { hairline } from "../../../../engine/frame";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, headOf, rankOf } from "./parts";

const COUNT = [1, 2, 4, 7] as const;
const LENGTH = [10, 12, 14, 17] as const;
const ROWS = [0, -5, 5, -9, 9, -13, 13] as const;
const STAGGER = 0.07;

export const VOLLEY: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const n = COUNT[rank] + (rank >= 1 ? Math.round(cast.gradeInTier * 2) : 0);
  const length = LENGTH[rank] * grade(cast);
  const head = Math.max(24, headOf(at));
  const alpha = fadeOut(progress, fade);
  for (let i = 0; i < n; i++) {
    const go = ease.outCubic(smooth(i * STAGGER * 0.6, 0.55 + i * STAGGER * 0.4, progress));
    if (go <= 0) continue;
    const row = ROWS[i % ROWS.length] * (rank >= 2 ? 1.2 : 1);
    const startY = rank >= 3 ? row * 2.4 : row;
    const fromX = -8 - (i % 3) * 3;
    const x = fromX + (head - fromX) * go;
    const y = startY + (row * 0.3 - startY) * go;
    const angle = Math.atan2(row * 0.3 - startY, head - fromX);
    if (rank >= 1) {
      hairline(x - length * 1.6, y - Math.tan(angle) * length * 1.6, x - length * 0.2, y, R[3], alpha * 0.6);
      kit.motif(x - length * 1.2, y, Math.PI + angle, 3 + rank, alpha * 0.7, rank);
    }
    if (rank >= 2) hairline(fromX, startY, x - length, y, R[2], alpha * 0.3);
    drawFxSword(kit, x - length, y, angle, length, alpha);
  }
};
