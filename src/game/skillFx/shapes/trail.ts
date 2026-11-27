import { W } from "../../../constants/stage";
import { glowLine, hairline, line, polygon } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { smooth } from "../../../utils/math";

const CUT_EVERY = 30;

export const drawTrail: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const face = at.face ?? 1;
  const dx = ((at.toX ?? at.x + face * 40) - at.x) * face;
  const dy = (at.toY ?? at.y) - at.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const start = smooth(0.1, 1, progress);
  const sx = dx * start;
  const sy = dy * start;
  const width = (1 + rank * 1.2) * cast.size * (1 - progress * 0.6);
  polygon(
    [
      [sx, sy],
      [dx + nx * width, dy + ny * width],
      [dx + (dx / len) * 4, dy + (dy / len) * 4],
      [dx - nx * width, dy - ny * width],
    ],
    R[3],
    fade,
  );
  line(sx, sy, dx, dy, R[4], fade);
  hairline(sx, sy - 0.5, dx, dy - 0.5, WHITE, fade);
  glowLine(sx, sy, dx, dy, 4 + width * 2, R[3], 0.21 * fade);
  if (rank >= 1) {
    const motifs = Math.floor(len / (12 - rank * 2));
    for (let i = 1; i < motifs; i++) {
      const u = i / motifs;
      if (u < start) continue;
      const side = i % 2 ? 1 : -1;
      kit.motif(dx * u, dy * u, Math.atan2(ny * side, nx * side), 2 + rank, fade * u, rank);
    }
  }
  if (rank >= 2) {
    for (const s of [-1, 1]) {
      const o = s * width * 2.5;
      hairline(sx + nx * o, sy + ny * o, dx + nx * o * 0.4, dy + ny * o * 0.4, R[4], fade * 0.8);
    }
    kit.core(dx, dy, 2 + rank, fade * (1 - progress), rank);
  }
  if (rank >= 3) {
    for (let d = CUT_EVERY; d < len; d += CUT_EVERY) {
      const u = d / len;
      if (u < start) continue;
      const cx = dx * u;
      const cy = dy * u;
      const arm = 2.5 * cast.size * (1 - progress);
      line(cx - arm, cy - arm, cx + arm, cy + arm, R[4], fade);
      line(cx - arm, cy + arm, cx + arm, cy - arm, R[4], fade);
      hairline(cx - arm, cy - arm - 0.5, cx + arm, cy + arm - 0.5, WHITE, fade);
    }
  }
  if (cast.fillsScreen) {
    const beam = 1 - smooth(0, 0.5, progress);
    hairline(-W, 0, W, 0, R[5], beam * fade);
    glowLine(-W, 0, W, 0, 6, R[3], 0.21 * beam * fade);
  }
};
