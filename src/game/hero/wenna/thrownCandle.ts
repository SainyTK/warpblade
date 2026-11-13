import { THROWN_CANDLE as C } from "../../../constants/wenna/warp";
import { WICK_FLAME as F, WICK_WAX as X } from "../../../constants/wenna/wickLook";
import { fleck, glow, hairline } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

/** the wax across the candle from its lit side to its shaded side, one image pixel apart */
const ACROSS = [X.light, X.body, X.body, X.mid, X.shade] as const;

/**
 * A short ivory candle centred at (x, y) along `axis` (radians, from its foot to its wick), lit on one side and shaded
 * on the other with a dark foot and a black wick, its violet flame streaming from the wick along `flame` (radians),
 * gold at the root and white hot at the heart.
 */
function paintCandle(x: number, y: number, axis: number, flame: number): void {
  const c = Math.cos(axis);
  const n = Math.sin(axis);
  const half = C.length / 2;
  const at = (along: number, across: number): [number, number] => [
    x + c * along - n * across,
    y + n * along + c * across,
  ];
  ACROSS.forEach((col, i) => {
    const across = -C.half + (i * (C.half * 2)) / (ACROSS.length - 1);
    hairline(...at(-half, across), ...at(half - 0.5, across), col);
  });
  hairline(...at(-half, -C.half), ...at(-half, C.half), X.deep);
  hairline(...at(half, -C.half), ...at(half, C.half), X.crown);
  const [wx, wy] = at(half + 0.5, 0);
  fleck(wx, wy, X.ink);
  const fx = Math.cos(flame);
  const fy = Math.sin(flame);
  const tip: [number, number] = [wx + fx * C.flame, wy + fy * C.flame];
  hairline(wx, wy, ...tip, (u) => (u < 0.2 ? F.root : u < 0.5 ? F.heart : u < 0.8 ? F.body : F.tip));
  hairline(wx + fy * 0.5, wy - fx * 0.5, tip[0], tip[1], F.edge, 0.8);
  hairline(wx - fy * 0.5, wy + fx * 0.5, tip[0], tip[1], F.edge, 0.8);
  fleck(wx + fx, wy + fy, WHITE);
  glow(wx, wy, 7, F.body, 0.45);
}

/** her warp's candle in flight at (x, y), heading along `angle`, `t` seconds after it left her hand: it tumbles end
 *  over end and its flame streams back against the flight */
export function drawThrownCandle(x: number, y: number, angle: number, t: number): void {
  paintCandle(x, y, angle + t * C.spin, angle + Math.PI);
}

/** the candle held upright in her hand at (x, y) before the throw, its flame standing up */
export function drawHeldCandle(x: number, y: number): void {
  paintCandle(x, y - C.length / 2, -Math.PI / 2, -Math.PI / 2);
}
