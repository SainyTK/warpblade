import { circle, hairline, polygon } from "../../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawMoon, fadeOut, grade, rankOf } from "./parts";

const TALL = [16, 18, 20, 22] as const;
const COPIES = [[0], [0], [0, -10], [0, -12, 12]] as const;

function figure(kit: ElementKit, x: number, tall: number, alpha: number): void {
  const R = kit.look.ramp;
  const s = tall / 20;
  const body: [number, number][] = [
    [x - 3 * s, 0],
    [x - 2 * s, -9 * s],
    [x - 3.5 * s, -15 * s],
    [x + 3 * s, -16 * s],
    [x + 3.5 * s, -9 * s],
    [x + 4 * s, 0],
  ];
  if (alpha < 0.3) return;
  polygon(body, kit.look.dark, 1);
  circle(x, -18 * s, 2.6 * s, kit.look.dark, 1);
  hairline(x - 3 * s, 0, x - 3.5 * s, -15 * s, R[2], 1);
  hairline(x + 3 * s, -16 * s, x + 4 * s, 0, R[3], alpha);
  hairline(x + 1.6 * s, -20 * s, x + 2.6 * s, -17 * s, R[4], alpha);
}

export const SHADE: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const tall = TALL[rank] * grade(cast);
  const show = ease.outCubic(Math.min(1, progress * 4));
  const alpha = fadeOut(progress, fade);
  for (const dx of COPIES[rank]) figure(kit, -10 + dx * show, tall, alpha * (dx ? 0.8 : 1));
  const cut = ease.outCubic(smooth(0.1, 0.4, progress));
  drawMoon(kit, -4 + 10 * cut, -tall * 0.55, tall * 0.55 * (1 + rank * 0.2), 2 + rank, alpha * cut);
  if (rank >= 1) {
    for (let i = 0; i < 2 + rank; i++) {
      kit.motif(-14, -4 - i * (tall / (2 + rank)), Math.PI, 3 + rank, alpha * 0.6, rank);
    }
  }
  if (rank >= 3) drawMoon(kit, -16 - 10 * cut, -tall * 0.55, tall * 0.6, 3, alpha * cut, -1);
};
