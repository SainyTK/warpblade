import { DOUBLE_TAP } from "../../constants/input";
import { take } from "../input";
import { game } from "../state";

const last = { dir: 0, t: Number.NEGATIVE_INFINITY };

/** the side tapped twice in a row this step, or 0; a run press counts as a double tap toward the held side `dir` */
export function readDoubleTap(dir: number): number {
  let out = take("run") ? dir : 0;
  for (const [action, side] of [
    ["left", -1],
    ["right", 1],
  ] as const) {
    if (!take(action)) continue;
    if (last.dir === side && game.t - last.t <= DOUBLE_TAP) {
      out = side;
      last.t = Number.NEGATIVE_INFINITY;
    } else {
      last.dir = side;
      last.t = game.t;
    }
  }
  return out;
}
