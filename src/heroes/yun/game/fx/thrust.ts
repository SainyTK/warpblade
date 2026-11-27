import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawArc, drawFxSword, fadeOut, grade, rankOf } from "./parts";

const LENGTH = [16, 22, 30, 40] as const;
const WING = [0, 7, 10, 15] as const;

function wings(
  kit: ElementKit,
  tipX: number,
  dir: number,
  span: number,
  open: number,
  alpha: number,
  rank: number,
): void {
  const R = kit.look.ramp;
  for (const s of [-1, 1]) {
    for (let k = 0; k < rank; k++) {
      const r = span * (1 - k * 0.22) * open;
      const from = s < 0 ? -Math.PI * 0.95 : Math.PI * 0.05;
      drawArc(tipX - dir * r * 0.6, 0, r, r * 1.1, from, from + Math.PI * 0.9, k ? R[3] : R[5], alpha);
    }
    kit.motif(tipX - dir * span * 0.4, s * span * 0.9 * open, s * Math.PI * 0.4, 2 + rank, alpha * 0.8, rank);
  }
}

export const THRUST: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const length = LENGTH[rank] * grade(cast);
  const go = ease.outCubic(Math.min(1, progress * 4));
  const alpha = fadeOut(progress, fade);
  const sides = rank >= 3 ? [1, -1] : [1];
  for (const s of sides) {
    const tip = s * (4 + length * go);
    const angle = s > 0 ? 0 : Math.PI;
    drawFxSword(kit, tip - s * length, 0, angle, length, alpha);
    if (rank >= 1) {
      const open = ease.outBack(smooth(0.15, 0.45, progress));
      wings(kit, tip, s, WING[rank] * grade(cast), open, alpha, rank);
    }
    if (rank >= 2) {
      const lag = ease.outCubic(smooth(0.08, 0.4, progress));
      for (const dy of rank >= 3 ? [-6, 6] : [-5]) {
        drawFxSword(kit, s * (length * 0.7 * lag) - s * length * 0.7, dy, angle, length * 0.7, alpha * 0.8);
      }
    }
  }
};
