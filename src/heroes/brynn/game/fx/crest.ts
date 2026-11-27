import { polygon } from "../../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { ease, smooth } from "../../../../utils/math";

const REACH = [28, 44, 62, 90] as const;
const ROCK = [3, 5, 7, 10] as const;
const SPACING = 6;

interface Run {
  face: number;
  front: number;
  tail: number;
  tall: number;
  seed: number;
}

function rocks(kit: ElementKit, { face, front, tail, tall, seed }: Run, alpha: number): void {
  const R = kit.look.ramp;
  for (let x = front; x > tail; x -= SPACING) {
    const v = (x - tail) / Math.max(1, front - tail);
    const h = tall * v * (0.6 + 0.6 * grain(Math.floor(x / SPACING), seed));
    if (h < 1) continue;
    const px = x * face;
    polygon(
      [
        [px - 2.5 * face, 1],
        [px - 1 * face, -h],
        [px + 0.8 * face, -h * 0.75],
        [px + 2.5 * face, 1],
      ],
      R[1],
      alpha,
    );
    polygon(
      [
        [px - 1.2 * face, 0],
        [px - 0.6 * face, -h * 0.85],
        [px + 0.5 * face, -h * 0.6],
        [px + 1.2 * face, 0],
      ],
      R[3],
      alpha,
    );
  }
}

export const CREST: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const reach = REACH[rank] * cast.size * 0.7;
  const front = 4 + reach * ease.outCubic(progress);
  const tail = Math.max(0, front - 14 - rank * 6);
  const tall = ROCK[rank] * (1 - smooth(0.6, 1, progress) * 0.7);
  rocks(kit, { face: 1, front, tail, tall, seed: 3 }, fade);
  if (rank >= 1) kit.motif(front + 2, 0, -Math.PI / 2 + 0.5, tall * 1.3, fade, rank);
  if (rank >= 2) rocks(kit, { face: -1, front: front * 0.8, tail: tail * 0.8, tall: tall * 0.8, seed: 7 }, fade * 0.9);
  if (rank >= 3) {
    const late = front * smooth(0.2, 1, progress);
    rocks(kit, { face: 1, front: late, tail: Math.max(0, late - 20), tall: tall * 1.4, seed: 11 }, fade * 0.85);
    rocks(
      kit,
      { face: -1, front: late * 0.8, tail: Math.max(0, late * 0.8 - 20), tall: tall * 1.2, seed: 13 },
      fade * 0.8,
    );
  }
};
