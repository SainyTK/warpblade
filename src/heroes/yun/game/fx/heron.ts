import { fleck, hairline, polygon } from "../../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { fadeOut, grade, headOf, rankOf } from "./parts";

const SIZE = [6, 8, 10, 13] as const;
const FLOCK = [
  [[0, 0]],
  [[0, 0]],
  [
    [0, 0],
    [-10, -7],
  ],
  [
    [0, 0],
    [-12, -9],
    [-12, 9],
    [-24, -16],
  ],
] as const;

function bird(kit: ElementKit, x: number, y: number, size: number, beat: number, alpha: number, rank: number): void {
  const R = kit.look.ramp;
  const lift = Math.sin(beat) * size * 0.9;
  const body: [number, number][] = [
    [x - size, y],
    [x + size * 0.4, y - size * 0.2],
    [x + size * 0.9, y - size * 0.5],
    [x + size * 1.3, y - size * 0.45],
    [x + size * 0.5, y + size * 0.15],
  ];
  polygon(body, R[4], alpha);
  for (const s of [-1, 1]) {
    polygon(
      [
        [x - size * 0.2, y],
        [x - size * 0.6, y - s * lift - size * 0.2],
        [x - size * 1.4, y - s * lift * 1.2],
        [x + size * 0.3, y - size * 0.1],
      ],
      s < 0 ? R[3] : R[5],
      alpha * (s < 0 ? 0.8 : 1),
    );
  }
  hairline(x - size, y, x - size * 1.6, y + size * 0.15, R[2], alpha);
  fleck(x + size * 1.3, y - size * 0.45, R[5], alpha);
  if (rank >= 1) kit.motif(x - size * 1.4, y, Math.PI, size * 0.8, alpha * 0.7, rank);
}

export const HERON: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const size = SIZE[rank] * grade(cast);
  const head = Math.max(30, headOf(at));
  const go = ease.outCubic(smooth(0, 0.85, progress));
  const alpha = fadeOut(progress, fade, 0.8);
  for (const [dx, dy] of FLOCK[rank]) {
    const x = 4 + head * go + dx;
    if (rank >= 2) hairline(x - size * 4, dy, x - size, dy, kit.look.ramp[3], alpha * 0.45);
    bird(kit, x, dy, size, progress * 18 + dx, alpha, rank);
  }
};
