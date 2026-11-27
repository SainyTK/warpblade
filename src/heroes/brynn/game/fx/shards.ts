import { fleck, hairline, polygon } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { CRIMSON } from "../../constants/colors";

const COUNT = [3, 5, 7, 10] as const;
const REACH = [7, 10, 13, 18] as const;

function crystal(x: number, y: number, angle: number, size: number, alpha: number): void {
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const at = (u: number, v: number): [number, number] => [x + ax * u - ay * v, y + ay * u + ax * v];
  polygon([at(-size, 0), at(0, -size * 0.6), at(size * 1.6, 0), at(0, size * 0.6)], CRIMSON[2], alpha);
  polygon([at(-size * 0.5, 0), at(0, -size * 0.35), at(size * 1.2, 0)], CRIMSON[4], alpha);
  hairline(...at(0, -size * 0.6), ...at(size * 1.6, 0), CRIMSON[5], alpha);
  fleck(...at(size * 0.2, -size * 0.15), CRIMSON[6], alpha);
}

export const SHARDS: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const n = COUNT[rank];
  const reach = REACH[rank] * (1 + cast.gradeInTier * 0.3);
  const out = ease.outCubic(Math.min(1, progress * 2.5));
  const alpha = fade * (1 - smooth(0.75, 1, progress));
  const size = 1.4 + rank * 0.45;
  const spin = rank >= 3 ? progress * 2 : 0;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU - Math.PI / 2 + spin;
    const x = Math.cos(a) * reach * out;
    const y = Math.sin(a) * reach * out * (rank >= 3 ? 1 : 0.8);
    if (rank >= 1) kit.motif(x * 0.4, y * 0.4, a, reach * 0.5 * out, alpha * 0.8, rank);
    crystal(x, y, rank >= 3 ? a + Math.PI / 2 : a, size, alpha);
  }
  if (rank >= 2) fineRing(0, 0, reach * out, reach * out * (rank >= 3 ? 1 : 0.8), R[3], alpha * 0.7);
  if (rank >= 3) fineRing(0, 0, reach * out + 3, reach * out + 3, R[4], alpha * 0.6);
};
