import { KITE_SHAPE } from "../../../constants/orrin/chainLook";
import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { glow, hairline, place } from "../../../engine/frame";
import type { Point } from "../../../types/world";
import { drawTurned } from "../../effects/orrin/turned";

const B = PAL.brass;

/**
 * A brass kite, 9 px tall, at full detail: a diamond with a dark edge, its four panels each in their own tone of brass
 * so it reads as folded, a dark spine and cross spar, a glint, and two ribbon tails that ripple behind it. It tips
 * nose-down while it dives. A faint steel string sags back to `hand` when it has one.
 */
export function drawKite(x: number, y: number, t: number, diving: boolean, hand: Point | null, alpha: number): void {
  if (alpha <= 0) return;
  place();
  const flutter = Math.sin(t * 9);
  if (hand) {
    const mx = (hand.x + x) / 2;
    const my = (hand.y + y) / 2 + 6;
    hairline(hand.x, hand.y, mx, my, HC.steelDark, 0.6 * alpha);
    hairline(mx, my, x, y + 3, HC.steelDark, 0.6 * alpha);
  }
  const tilt = diving ? 0.9 : 0.2 * flutter;
  // the kite's own up, turned by its tilt: "along" runs from its nose down to its tail
  const ux = -Math.sin(tilt);
  const uy = Math.cos(tilt);
  const { tall, wide, tails, tailLength } = KITE_SHAPE;
  for (let i = 0; i < tails; i++) {
    const side = i === 0 ? -0.6 : 0.6;
    let fromX = x + ux * tall;
    let fromY = y + uy * tall;
    for (let k = 1; k <= tailLength; k++) {
      const wave = Math.sin(t * 10 - k * 0.9 + i * 1.7) * (0.4 + k * 0.18);
      const toX = x + ux * (tall + k) + uy * (wave + side * k * 0.25);
      const toY = y + uy * (tall + k) - ux * (wave + side * k * 0.25);
      hairline(fromX, fromY, toX, toY, k % 2 ? B[3] : B[2], alpha * (1 - k / (tailLength + 2)));
      fromX = toX;
      fromY = toY;
    }
  }
  drawTurned(
    x,
    y,
    ux,
    uy,
    tall + 1,
    (d, w) => {
      // the widest point sits a third of the way down from the nose
      const k = d < -tall / 3 ? (d + tall) / (tall * (2 / 3)) : (tall - d) / (tall * (4 / 3));
      const half = wide * k;
      if (k < 0 || Math.abs(w) > half + 0.5) return 0;
      if (Math.abs(w) > half - 0.1) return B[0];
      if (Math.abs(w) < 0.3 || Math.abs(d + tall / 3) < 0.3) return B[1];
      const upper = d < -tall / 3;
      return upper ? (w > 0 ? B[5] : B[4]) : w > 0 ? B[3] : B[2];
    },
    alpha,
  );
  if (diving) glow(x, y, 7, B[3], 0.3 * alpha);
}
