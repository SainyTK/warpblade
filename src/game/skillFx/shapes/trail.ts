import { W } from "../../../constants/stage";
import { glowLine, hairline, line, polygon } from "../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../types/skillFx";
import { smooth } from "../../../utils/math";

const CUT_EVERY = 22;
const WIDTH_BY_RANK = [1.5, 2.5, 4, 6] as const;
const CUT_BY_RANK = [0, 0, 4, 7] as const;

function streak(kit: ElementKit, sx: number, sy: number, dx: number, dy: number, width: number, fade: number): void {
  const R = kit.look.ramp;
  const len = Math.hypot(dx - sx, dy - sy) || 1;
  const nx = -(dy - sy) / len;
  const ny = (dx - sx) / len;
  polygon(
    [
      [sx, sy],
      [dx + nx * width, dy + ny * width],
      [dx + ((dx - sx) / len) * 4, dy + ((dy - sy) / len) * 4],
      [dx - nx * width, dy - ny * width],
    ],
    R[3],
    fade,
  );
  line(sx, sy, dx, dy, R[4], fade);
  hairline(sx, sy - 0.5, dx, dy - 0.5, R[5], fade);
  glowLine(sx, sy, dx, dy, 4 + width * 1.5, R[3], 0.15 * fade);
}

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
  const width = WIDTH_BY_RANK[rank] * (1 + 0.35 * cast.gradeInTier) * (1 - progress * 0.6);
  streak(kit, sx, sy, dx, dy, width, fade);
  if (rank >= 1) {
    const motifs = Math.floor(len / 8);
    for (let i = 1; i < motifs; i++) {
      const u = i / motifs;
      if (u < start) continue;
      const side = i % 2 ? 1 : -1;
      kit.motif(dx * u, dy * u, Math.atan2(ny * side, nx * side), 3 + rank * 2, fade * u, rank);
    }
    kit.core(dx, dy, (1.5 + rank) * (1 - progress), fade, rank);
  }
  if (rank >= 2) {
    for (const s of [-1, 1]) {
      const o = s * (width * 2 + 3);
      streak(kit, sx + nx * o, sy + ny * o, dx + nx * o * 0.4, dy + ny * o * 0.4, width * 0.4, fade * 0.8);
    }
    const arm = CUT_BY_RANK[rank] * (1 - progress * 0.5);
    for (let d = CUT_EVERY; d < len; d += CUT_EVERY) {
      const u = d / len;
      if (u < start) continue;
      const cx = dx * u;
      const cy = dy * u;
      line(cx - arm, cy - arm, cx + arm, cy + arm, R[4], fade);
      line(cx - arm, cy + arm, cx + arm, cy - arm, R[4], fade);
      hairline(cx - arm, cy - arm - 0.5, cx + arm, cy + arm - 0.5, R[5], fade);
    }
  }
  if (rank >= 3) {
    const lift = -10;
    streak(kit, sx - 6, sy + lift, dx - 6, dy + lift, width * 0.5, fade * 0.7);
    streak(kit, sx - 12, sy - lift, dx - 12, dy - lift, width * 0.5, fade * 0.7);
  }
  if (cast.fillsScreen) {
    const beam = 1 - smooth(0, 0.5, progress);
    hairline(-W, 0, W, 0, R[5], beam * fade);
    glowLine(-W, 0, W, 0, 5, R[3], 0.15 * beam * fade);
  }
};
