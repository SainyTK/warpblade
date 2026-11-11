import { WICK_FLAME } from "../../../constants/wenna/wickLook";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";

/** a flame to paint: where its root sits, its size, how it leans and how bright it burns */
export interface FlameSpec {
  x: number;
  y: number;
  tall: number;
  wide: number;
  /** how far the tip is blown ahead (behind when negative), in art pixels */
  bend: number;
  /** 0 as it burns, 1 brighter (a bite's start, a paler extra Wick), 2 white hot */
  lift: number;
  /** the flicker's clock and a number that sets this flame apart from its neighbours */
  t: number;
  seed: number;
}

/** how wide the flame is at a height from 0 (its root) to 1 (its tip): a bulb low down drawn out to a point */
const profile = (up: number): number => (1 - up) ** 0.8 * Math.min(1, 0.4 + up * 2.8);

/**
 * A flame painted pixel by pixel onto the layer under way: a teardrop that licks from side to side, gold at its root,
 * pale at its heart, violet at its edge and darker at its tip, with a loose tongue above it now and then.
 */
export function paintFlame(s: SpriteCanvas, f: FlameSpec): void {
  const rows = Math.max(1, Math.round(f.tall * s.res));
  const step = 1 / s.res;
  const hot = f.lift >= 2 ? WHITE : WICK_FLAME.heart;
  const body = f.lift >= 1 ? WICK_FLAME.heart : WICK_FLAME.body;
  const edge = f.lift >= 1 ? WICK_FLAME.body : WICK_FLAME.edge;
  for (let v = 0; v < rows; v++) {
    const up = v / rows;
    const hw = Math.max(step * 0.5, f.wide * profile(up));
    const lick = Math.sin(f.t * 9 + v * 0.55 + f.seed) * up * f.wide * 0.3;
    const off = f.bend * up ** 1.4 + lick;
    for (let u = -hw; u <= hw; u += step) {
      const d = Math.abs(u) / hw;
      const c =
        up < 0.22 && d < 0.5
          ? WICK_FLAME.root
          : d < 0.42 && up < 0.62
            ? hot
            : d < 0.75 && up < 0.82
              ? body
              : up > 0.86
                ? WICK_FLAME.tip
                : edge;
      s.set(f.x + off + u, f.y - v * step, c);
    }
  }
  if (Math.sin(f.t * 5 + f.seed * 3) > 0.3) {
    const tipX = f.x + f.bend * 1.25 + Math.sin(f.t * 9 + rows * 0.55 + f.seed) * f.wide * 0.4;
    s.set(tipX, f.y - f.tall - step * 2, WICK_FLAME.edge);
  }
}
