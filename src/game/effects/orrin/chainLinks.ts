import { HERO_COLORS as HC } from "../../../constants/palette";
import { px } from "../../../engine/frame";
import type { Color } from "../../../types/color";

/**
 * A run of chain links from one world point to another: 3 px links alternating face-on ovals and side-on bars every
 * 3 px, each with a dark edge under a steel highlight. The caller has placed the frame in world space.
 */
export function drawLinks(x0: number, y0: number, x1: number, y1: number, glint: Color = HC.steelLight, a = 1): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  for (let d = 0, i = 0; d <= len; d += 3, i++) {
    const x = x0 + ux * d;
    const y = y0 + uy * d;
    if (i % 2 === 0) {
      px(x - nx * 0.6, y - ny * 0.6, HC.steelDeep, a);
      px(x + nx * 0.6, y + ny * 0.6, HC.steelDeep, a);
      px(x + ux, y + uy, HC.steel, a);
      px(x - nx * 0.4 + ux * 0.5, y - ny * 0.4 + uy * 0.5, glint, a);
    } else {
      px(x, y, HC.steelDark, a);
      px(x + ux, y + uy, HC.steel, a);
    }
  }
}
