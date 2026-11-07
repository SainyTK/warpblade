import { HERO_COLORS as HC } from "../../../constants/palette";
import { px } from "../../../engine/frame";
import type { Color } from "../../../types/color";

/**
 * A run of chain links from one world point to another: an unbroken dark core, and on it a link every 3 px that
 * alternates a face-on oval (dark edges round a steel highlight) and a side-on bar. The caller has placed the frame in
 * world space.
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
  for (let d = 0; d <= len; d++) px(x0 + ux * d, y0 + uy * d, HC.steelDark, a);
  for (let d = 1, i = 0; d <= len - 1; d += 3, i++) {
    const x = x0 + ux * d;
    const y = y0 + uy * d;
    if (i % 2 === 0) {
      px(x - nx, y - ny, HC.steelDeep, a);
      px(x + nx, y + ny, HC.steelDeep, a);
      px(x, y, glint, a);
      px(x + ux, y + uy, HC.steel, a);
    } else px(x, y, HC.steel, a);
  }
}
