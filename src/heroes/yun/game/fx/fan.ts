import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawArc, drawFxSword, fadeOut, grade, rankOf } from "./parts";

const COUNT = [3, 5, 7, 11] as const;
const HALF_SPREAD = [0.35, 0.6, 0.85, 1.45] as const;
const LENGTH = [10, 12, 14, 16] as const;
const REACH = [8, 12, 16, 22] as const;
const UP = -Math.PI / 2;
const LEAN = 0.35;

export const FAN: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const n = COUNT[rank];
  const half = HALF_SPREAD[rank];
  const length = LENGTH[rank] * grade(cast);
  const open = ease.outBack(Math.min(1, progress * 3.2));
  const reach = REACH[rank] * grade(cast) * open;
  const alpha = fadeOut(progress, fade);
  const centre = rank >= 3 ? UP : UP + LEAN;
  for (let i = 0; i < n; i++) {
    const a = centre - half + (2 * half * i) / Math.max(1, n - 1);
    const x = Math.cos(a) * reach;
    const y = Math.sin(a) * reach;
    if (rank >= 1) kit.motif(x + Math.cos(a) * length, y + Math.sin(a) * length, a, 2 + rank, alpha * 0.8, rank);
    drawFxSword(kit, x, y, a, length, alpha);
  }
  if (rank >= 2) {
    const inner = Math.max(2, n - 2);
    for (let i = 0; i < inner; i++) {
      const a = centre - half * 0.8 + (1.6 * half * (i + 0.5)) / inner;
      drawFxSword(kit, Math.cos(a) * reach * 0.4, Math.sin(a) * reach * 0.4, a, length * 0.7, alpha * 0.8);
    }
    drawArc(0, 0, reach + length, reach + length, centre - half, centre + half, R[4], alpha * 0.7);
  }
  if (rank >= 3) {
    const ring = smooth(0.1, 0.5, progress);
    fineRing(0, 0, (reach + length + 6) * ring, (reach + length + 6) * ring * 0.45, R[3], alpha * 0.7);
    drawArc(0, 0, reach + length + 4, reach + length + 4, centre - half, centre + half, R[5], alpha * 0.6);
  }
};
