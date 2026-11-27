import { FX_BUDGET } from "../../../constants/skillFx";
import { H, W } from "../../../constants/stage";
import { ellipseRing, glow, glowLine } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { ease, smooth, TAU } from "../../../utils/math";
import { floorArc } from "../../effects/fine";

const SQUASH = 0.26;
const MOTIF_MOST = 9;

export const drawNova: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const reach = cast.fillsScreen ? W * 0.6 : (at.reach ?? 26) * cast.size;
  const r = reach * ease.outExpo(progress) + 2;
  const k = 1 - progress;
  floorArc(0, 0, r, r * SQUASH, R[4], fade * 1.6 * k, 1, smooth(0.5, 1, progress), 3);
  floorArc(0, 0, r, r * SQUASH, R[3], fade * k, -1, smooth(0.4, 1, progress), 4);
  ellipseRing(0, 0, r * 0.85, r * SQUASH * 0.85, R[2], fade * k, 1);
  const standing = 6 + rank * 4;
  for (let i = 0; i < standing; i++) {
    const g = (i / standing) * TAU;
    const s = Math.sin(g);
    if (s < -0.2 && rank < 2) continue;
    kit.motif(Math.cos(g) * r, s * r * SQUASH, -Math.PI / 2, (3 + rank * 2) * cast.size * 0.6 * k, fade, rank);
  }
  glow(0, -4, Math.min(FX_BUDGET.maxGlow, r * 0.8), R[3], 0.15 * k * fade);
  if (rank >= 1) {
    const inner = reach * 0.55 * ease.outExpo(smooth(0.1, 1, progress));
    floorArc(0, 0, inner, inner * SQUASH, R[5], fade * k, 1, 0.3, 9);
  }
  if (rank >= 2) {
    const beam = 1 - smooth(0, 0.5, progress);
    glowLine(0, 0, 0, -60 * cast.size * 0.6, 6 + 6 * beam, R[3], 0.3 * beam * fade);
    kit.core(0, -8, (3 + rank) * beam, fade, rank);
  }
  if (rank >= 3) {
    const pillars = 8;
    const tall = cast.fillsScreen ? H : 40 * cast.size * 0.6;
    for (let i = 0; i < pillars; i++) {
      const g = (i / pillars) * TAU + 0.2;
      const px = Math.cos(g) * r * 0.8;
      const py = Math.sin(g) * r * SQUASH * 0.8;
      const h = tall * smooth(0.1, 0.35, progress) * k;
      glowLine(px, py, px, py - h, 4, R[3], 0.21 * fade);
      kit.motif(px, py, -Math.PI / 2, Math.min(MOTIF_MOST, h * 0.5), fade, rank);
    }
  }
};
