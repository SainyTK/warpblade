import { hairline, line } from "../../../../engine/frame";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { ease, smooth } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, rankOf } from "./parts";

const PAIRS = [1, 2, 4, 7] as const;
const SIZE = [7, 9, 12, 16] as const;

export const CUTS: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const size = SIZE[rank] * grade(cast);
  const alpha = fadeOut(progress, fade);
  const n = PAIRS[rank];
  for (let i = 0; i < n; i++) {
    const draw = ease.outCubic(smooth(i * 0.04, i * 0.04 + 0.18, progress));
    if (draw <= 0) continue;
    const a = rank >= 3 ? (i / n) * Math.PI : 0.75 + (grain(i, 3) - 0.5) * 0.6;
    const ox = rank >= 2 ? (grain(i, 5) - 0.5) * size * 0.8 : 0;
    const oy = rank >= 2 ? (grain(i, 9) - 0.5) * size * 0.8 : 0;
    for (const s of [1, -1]) {
      const ang = s > 0 ? a : Math.PI - a;
      const dx = Math.cos(ang) * size * draw;
      const dy = Math.sin(ang) * size * draw;
      line(ox - dx, oy - dy, ox + dx, oy + dy, R[2], alpha);
      hairline(ox - dx, oy - dy - 0.5, ox + dx, oy + dy - 0.5, R[5], alpha);
    }
  }
  if (rank >= 1) {
    const cross = ease.outCubic(smooth(0.05, 0.3, progress));
    drawFxSword(kit, -size * cross, -size * cross, Math.PI / 4, size * 1.6, alpha);
    drawFxSword(kit, size * cross, -size * cross, (Math.PI * 3) / 4, size * 1.6, alpha);
  }
  if (rank >= 2) {
    for (let i = 0; i < rank * 2; i++) kit.motif(0, 0, i * 1.1 + progress * 2, size * 0.9, alpha * 0.7, rank);
  }
};
