import { H } from "../../../../constants/stage";
import { hairline } from "../../../../engine/frame";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawGreatsword } from "./blade";

const LENGTH = [13, 19, 26, 36] as const;
const DOWN = Math.PI / 2;

export const PLANTED: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const length = cast.fillsScreen ? H * 0.32 : LENGTH[rank] * (1 + cast.gradeInTier * 0.3);
  const drop = ease.outCubic(Math.min(1, progress * 5));
  const sink = length * 0.28;
  const tipY = sink - length * 0.9 * (1 - drop);
  const alpha = fade * (1 - smooth(0.7, 1, progress) * 0.5);
  drawGreatsword(kit, 0, tipY - length, DOWN, length, alpha);
  if (rank >= 1 && drop >= 1) {
    for (const s of [-1, 1]) {
      hairline(0, 0, s * length * 0.5, -1, R[4], alpha);
      hairline(s * length * 0.5, -1, s * length * 0.8, 0, R[3], alpha * 0.8);
    }
  }
  if (rank >= 2) {
    const side = ease.outCubic(smooth(0.08, 0.3, progress));
    const small = length * 0.62;
    for (const s of [-1, 1]) {
      const a = DOWN - s * 0.32;
      const bx = s * length * 0.55 * side;
      drawGreatsword(kit, bx - Math.cos(a) * small, sink * 0.6 - Math.sin(a) * small, a, small, alpha * 0.85 * side);
    }
  }
  if (rank >= 3) {
    const ring = ease.outCubic(smooth(0.15, 0.4, progress));
    const far = length * 0.45;
    for (const s of [-1, 1]) {
      const a = DOWN - s * 0.65;
      const bx = s * length * 1.15 * ring;
      drawGreatsword(kit, bx - Math.cos(a) * far, sink * 0.4 - Math.sin(a) * far, a, far, alpha * 0.7 * ring);
    }
  }
};
