import { fleck, hairline } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { fadeOut, grade, rankOf } from "./parts";

const COUNT = [1, 3, 5, 9] as const;
const LENGTH = [6, 7, 8, 10] as const;
const FROM = 22;

export const NEEDLES: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const n = COUNT[rank];
  const length = LENGTH[rank] * grade(cast);
  const alpha = fadeOut(progress, fade, 0.8);
  for (let i = 0; i < n; i++) {
    const a = rank >= 3 ? (i / n) * TAU : Math.PI + (i - (n - 1) / 2) * 0.35;
    const go = ease.outCubic(smooth(i * 0.03, i * 0.03 + 0.2, progress));
    const r = 2 + FROM * (1 - go);
    const tipX = Math.cos(a) * r;
    const tipY = Math.sin(a) * r;
    const tailX = tipX + Math.cos(a) * length;
    const tailY = tipY + Math.sin(a) * length;
    hairline(tailX, tailY, tipX, tipY, R[4], alpha);
    fleck(tipX, tipY, R[5], alpha);
    fleck(tailX, tailY, R[2], alpha);
    if (rank >= 1 && go < 1)
      hairline(tailX + Math.cos(a) * 6, tailY + Math.sin(a) * 6, tailX, tailY, R[2], alpha * 0.5);
    if (rank >= 2 && go >= 1) kit.motif(tipX, tipY, a + Math.PI, 2 + rank, alpha * 0.6, rank);
  }
  if (rank >= 2) fineRing(0, 0, 4 + rank * 2, 4 + rank * 2, R[3], alpha * smooth(0.2, 0.4, progress));
  if (rank >= 3) fineRing(0, 0, 10 + 10 * progress, 10 + 10 * progress, R[4], alpha * 0.6);
};
