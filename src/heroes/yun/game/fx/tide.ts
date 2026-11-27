import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawArc, drawMoon, fadeOut, grade, rankOf } from "./parts";

const RADIUS = [10, 15, 20, 26] as const;
const DEPTH = 0.3;

function swirl(kit: ElementKit, cx: number, radius: number, open: number, alpha: number, rank: number): void {
  const R = kit.look.ramp;
  const from = Math.PI * 0.9;
  const to = from + Math.PI * 1.6 * open;
  for (let k = 0; k < 2 + rank; k++) {
    const r = radius - k * 1.2;
    drawArc(cx, -1 - k * 0.6, r, r * DEPTH, from, to, k === 0 ? R[5] : R[3 - Math.min(2, k - 1)], alpha);
  }
}

export const TIDE: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const radius = RADIUS[rank] * grade(cast);
  const open = ease.outCubic(Math.min(1, progress * 2.5));
  const alpha = fadeOut(progress, fade);
  const sides = rank >= 3 ? [-1, 1] : [1];
  for (const s of sides) {
    const cx = s * radius * (rank >= 3 ? 0.9 : 0.6);
    swirl(kit, cx, radius, open, alpha, rank);
    if (rank >= 1) {
      for (let i = 0; i < 3 + rank * 2; i++) {
        const a = Math.PI * (0.95 + (1.5 * i) / (3 + rank * 2));
        const x = cx + Math.cos(a) * radius;
        const y = Math.sin(a) * radius * DEPTH;
        kit.motif(x, y, -Math.PI / 2 + Math.cos(a) * 0.5, 2 + rank * 1.4, alpha * 0.75 * open, rank);
      }
    }
    if (rank >= 2) {
      const rise = ease.outCubic(smooth(0.1, 0.5, progress));
      drawMoon(kit, cx + s * radius * 0.9, -radius * 0.45 * rise, radius * 0.5 * rise, 2 + rank, alpha, s);
      swirl(kit, cx, radius * 1.45, smooth(0.15, 0.6, progress), alpha * 0.6, 0);
    }
  }
};
