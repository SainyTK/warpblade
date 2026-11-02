import { DOUBLE_TAP } from "../../constants/input";
import { take } from "../input";
import { game } from "../state";

const last = { dir: 0, t: Number.NEGATIVE_INFINITY };

/** the side tapped twice in a row this step, or 0 */
export function readDoubleTap(): number {
  let out = 0;
  for (const [action, dir] of [
    ["left", -1],
    ["right", 1],
  ] as const) {
    if (!take(action)) continue;
    if (last.dir === dir && game.t - last.t <= DOUBLE_TAP) {
      out = dir;
      last.t = Number.NEGATIVE_INFINITY;
    } else {
      last.dir = dir;
      last.t = game.t;
    }
  }
  return out;
}
