import { DEBT_MOTES } from "../../../constants/brannoc/fury";
import { PAL } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { smooth } from "../../../utils/math";
import { rng } from "../../state";

/** one mote: where it leaves from, how far it bows off the straight line, and how late it sets off */
interface Mote {
  bow: number;
  delay: number;
}

/**
 * Two or three crimson motes that fly from a struck foe into his chest over a quarter second, each on its own bowed
 * path with a one-pixel trail, brightening as they arrive: the debt he won back on that foe.
 */
export function createDebtMotes(fromX: number, fromY: number, toX: number, toY: number): Effect {
  const count = rng.int(DEBT_MOTES.min, DEBT_MOTES.max);
  const motes: Mote[] = Array.from({ length: count }, () => ({ bow: rng.range(-10, 10), delay: rng.range(0, 0.06) }));
  let t = 0;
  const end = DEBT_MOTES.flight + 0.06;
  const at = (m: Mote, u: number): [number, number] => {
    const k = smooth(0, 1, u);
    const lift = Math.sin(u * Math.PI) * m.bow;
    return [fromX + (toX - fromX) * k, fromY + (toY - fromY) * k - Math.abs(lift)];
  };
  return {
    update(dt) {
      t += dt;
      return t < end;
    },
    draw() {
      place();
      for (const m of motes) {
        const u = Math.min(1, Math.max(0, (t - m.delay) / DEBT_MOTES.flight));
        if (u <= 0 || u >= 1) continue;
        const [x, y] = at(m, u);
        const [bx, by] = at(m, Math.max(0, u - 0.12));
        px(bx, by, PAL.rage[2], 0.7);
        px(x, y, u > 0.7 ? PAL.rage[5] : PAL.rage[4]);
        glow(x, y, 4, PAL.rage[3], 0.25);
      }
    },
  };
}
