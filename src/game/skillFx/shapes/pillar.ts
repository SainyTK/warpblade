import { H } from "../../../constants/stage";
import { ellipseRing, glowLine, hairline, polygon } from "../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../types/skillFx";
import { ease, smooth } from "../../../utils/math";
import { ray } from "../../effects/fine";

const TALL_BY_RANK = [1, 1.4, 1.9, 2.6] as const;
const WIDTH_BY_RANK = [2, 3, 4.5, 6] as const;

function column(kit: ElementKit, x: number, height: number, width: number, fade: number, rank: number): void {
  const R = kit.look.ramp;
  polygon(
    [
      [x - width, 0],
      [x - width * 0.6, -height * 0.7],
      [x, -height],
      [x + width * 0.6, -height * 0.7],
      [x + width, 0],
    ],
    R[2],
    fade,
  );
  polygon(
    [
      [x - width * 0.55, 0],
      [x - width * 0.3, -height * 0.75],
      [x, -height * 0.96],
      [x + width * 0.3, -height * 0.75],
      [x + width * 0.55, 0],
    ],
    R[4],
    fade,
  );
  hairline(x, 0, x, -height * 0.92, R[5], fade);
  glowLine(x, 0, x, -height, width * 2 + 4, R[3], 0.15 * fade);
  if (rank < 1) return;
  const motifs = 2 + rank * 2;
  for (let i = 0; i < motifs; i++) {
    const v = (i + 0.5) / motifs;
    const side = i % 2 ? 1 : -1;
    const y = -height * v;
    const w = width * (1 - v * 0.6);
    kit.motif(x + side * w, y, side > 0 ? -0.6 : -Math.PI + 0.6, 3 + rank * 2.5, fade, rank);
  }
}

export const drawPillar: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const rise = ease.outExpo(Math.min(1, progress * 3));
  const thin = 1 - smooth(0.4, 1, progress) * 0.7;
  const grade = 1 + 0.3 * cast.gradeInTier;
  const tall = cast.fillsScreen ? H : (at.reach ?? 30) * TALL_BY_RANK[rank] * grade;
  const width = WIDTH_BY_RANK[rank] * grade * thin;
  const ring = (8 + rank * 7) * ease.outCubic(progress);
  ellipseRing(0, 0, ring, ring * 0.25, R[3], fade * (1 - progress), 1);
  ellipseRing(0, 0, ring * 0.7, ring * 0.18, R[4], fade * (1 - progress));
  column(kit, 0, tall * rise, width, fade, rank);
  if (rank >= 2) {
    const side = smooth(0.08, 0.35, progress);
    for (const s of [-1, 1]) {
      column(kit, s * width * 3.2, tall * 0.55 * rise * side, width * 0.55, fade * 0.85, rank - 1);
    }
  }
  if (rank >= 1) {
    const rays = 4 + rank * 2;
    for (let i = 0; i < rays; i++) {
      const a = -Math.PI + (i + 0.5) * (Math.PI / rays);
      ray(0, -2, a, ring * 0.3, ring * 1.1, R[5], R[4], fade * (1 - progress));
    }
  }
  if (rank >= 3) {
    const far = smooth(0.15, 0.45, progress);
    for (const s of [-1, 1]) {
      column(kit, s * width * 6, tall * 0.35 * rise * far, width * 0.4, fade * 0.7, 1);
    }
  }
};
