import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { circle, fleck, glow, hairline, line } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

/** the mallet in flight: its length from butt to felt, the felt head's radius, and how fast it turns end over end */
const MALLET = { length: 10, head: 1.4, spin: 26 } as const;
/** ghosts of the felt head left along its turn, each this many radians behind the last */
const BLUR = { count: 3, step: 0.42 } as const;

/**
 * Jory's mallet thrown at a foe, turning end over end round its middle at (x, y): a dark wood shaft with a lit edge, a
 * cobalt felt head with a white glint, and fading ghosts of the head along the arc it has just turned through.
 */
export function drawThrownMallet(x: number, y: number, _angle: number, t: number): void {
  const a = t * MALLET.spin;
  const half = MALLET.length / 2;
  const at = (turn: number, d: number): [number, number] => [x + Math.cos(turn) * d, y + Math.sin(turn) * d];
  for (let i = BLUR.count; i >= 1; i--) {
    const [gx, gy] = at(a - i * BLUR.step, half);
    circle(gx, gy, MALLET.head * 0.8, PAL.beat[2], 0.55 - i * 0.14);
  }
  const [bx, by] = at(a + Math.PI, half);
  const [hx, hy] = at(a, half - MALLET.head);
  line(bx, by, hx, hy, HC.hilt);
  const n = Math.cos(a) * 0.5;
  const m = Math.sin(a) * 0.5;
  hairline(bx - m, by + n, hx - m, hy + n, HC.gloveLight);
  const [fx, fy] = at(a, half);
  circle(fx, fy, MALLET.head, PAL.beat[3]);
  circle(fx - 0.3, fy - 0.3, MALLET.head * 0.55, PAL.beat[4]);
  fleck(fx - 0.6, fy - 0.7, WHITE);
  glow(fx, fy, 6, PAL.beat[3], 0.3);
}
