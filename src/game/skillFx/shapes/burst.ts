import { FX_BUDGET } from "../../../constants/skillFx";
import { H } from "../../../constants/stage";
import { glow, glowLine, hairline } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease, smooth, TAU } from "../../../utils/math";
import { fineRing, ray } from "../../effects/fine";

const SATELLITES = 4;

export const drawBurst: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const size = cast.size * (at.reach ?? 10) * 0.1;
  const open = ease.outCubic(Math.min(1, progress * 2));
  const radius = 7 * size * open + 2;
  const coreLeft = 1 - smooth(0, 0.55, progress);
  if (coreLeft > 0) kit.core(0, 0, (2.5 + rank * 0.8) * size * coreLeft + 0.5, fade, rank);
  const spokes = 5 + rank * 3;
  for (let i = 0; i < spokes; i++) {
    const a = ((i + grain(i, rank) * 0.5) / spokes) * TAU;
    kit.motif(
      Math.cos(a) * radius,
      Math.sin(a) * radius,
      a,
      (3 + rank * 1.5) * size * (1 - progress * 0.5),
      fade,
      rank,
    );
  }
  if (rank >= 1) fineRing(0, 0, radius * 1.35, radius * 1.35, R[4], fade * (1 - progress));
  if (rank >= 2) {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + Math.PI / 4;
      ray(0, 0, a, radius * 0.4, radius * 2.2, WHITE, R[4], fade * (1 - progress));
    }
    const outer = radius * 1.7;
    for (let i = 0; i < spokes; i++) {
      const a = ((i + 0.5) / spokes) * TAU;
      kit.motif(Math.cos(a) * outer, Math.sin(a) * outer, a, 2 * size, fade * 0.8, rank);
    }
  }
  if (rank >= 3) {
    for (let i = 0; i < SATELLITES; i++) {
      const local = smooth(0.12 + i * 0.07, 0.5 + i * 0.07, progress);
      if (local <= 0 || local >= 1) continue;
      const a = (i / SATELLITES) * TAU + grain(i, 7);
      const d = radius * 2.1;
      const sx = Math.cos(a) * d;
      const sy = Math.sin(a) * d * 0.6;
      kit.core(sx, sy, 1.6 * Math.sqrt(size) * (1 - local) + 0.5, fade, 2);
      fineRing(sx, sy, 5 * size * local + 1, 5 * size * local + 1, R[4], fade * (1 - local));
    }
  }
  if (cast.fillsScreen) {
    const beam = 1 - smooth(0, 0.6, progress);
    glowLine(0, 0, 0, -H, 5 + 6 * beam, R[3], 0.18 * beam * fade);
    hairline(0, 0, 0, -H, WHITE, beam * fade);
    glow(0, 0, Math.min(FX_BUDGET.maxGlow, 40 * size * open), R[2], 0.07 * fade);
  }
};
