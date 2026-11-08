import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { glow, line, place, px } from "../../../engine/frame";
import type { Point } from "../../../types/world";

const B = PAL.brass;

/**
 * A brass kite, 9 px tall: a diamond with a dark edge, a lit upper half and a shaded lower half, a cross spar, and two
 * ribbon tails that flutter. It tips nose-down while it dives. A faint steel string runs back to `hand` when it has one.
 */
export function drawKite(x: number, y: number, t: number, diving: boolean, hand: Point | null, alpha: number): void {
  if (alpha <= 0) return;
  place();
  const flutter = Math.sin(t * 9);
  if (hand) {
    // the string sags a little between his hand and the kite
    const mx = (hand.x + x) / 2;
    const my = (hand.y + y) / 2 + 6;
    line(hand.x, hand.y, mx, my, HC.steelDark, 0.35 * alpha);
    line(mx, my, x, y + 3, HC.steelDark, 0.35 * alpha);
  }
  const tilt = diving ? 0.9 : 0.2 * flutter;
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  const at = (lx: number, ly: number): [number, number] => [x + lx * c - ly * s, y + lx * s + ly * c];
  // the sail, row by row: a diamond 7 px wide and 9 px tall
  for (let ly = -4; ly <= 4; ly++) {
    const half = Math.round(3 - Math.abs(ly) * 0.75);
    for (let lx = -half; lx <= half; lx++) {
      const edge = Math.abs(lx) === half || Math.abs(ly) === 4;
      const col = edge ? B[0] : ly < 0 ? (lx < 0 ? B[4] : B[3]) : lx < 0 ? B[3] : B[2];
      const [wx, wy] = at(lx, ly);
      px(wx, wy, col, alpha);
    }
  }
  const [gx, gy] = at(-1, -2);
  const [hx, hy] = at(-2, -1);
  px(hx, hy, B[5], alpha * 0.7);
  px(gx, gy, B[5], alpha);
  // the cross spar and the spine
  const [sx0, sy0] = at(-2, -1);
  const [sx1, sy1] = at(2, -1);
  const [px0, py0] = at(0, -3);
  const [px1, py1] = at(0, 3);
  line(px0, py0, px1, py1, B[2], 0.7 * alpha);
  line(sx0, sy0, sx1, sy1, HC.steelDeep, 0.8 * alpha);
  // two ribbon tails off the bottom point
  const [tx, ty] = at(0, 5);
  for (let i = 0; i < 4; i++) {
    const wave = Math.sin(t * 10 - i * 1.3) * 1.2;
    px(tx + wave - i * 0.4, ty + i + 1, i % 2 ? B[2] : B[3], alpha * (1 - i * 0.18));
  }
  if (diving) glow(x, y, 7, B[3], 0.3 * alpha);
}
