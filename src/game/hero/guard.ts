import { hero } from "../state";
import { MOVES } from "./moves";

/** Kael cannot be hurt while blinking after a hit, dashing, warping, in his ultimate, or in a guarded move */
export function heroGuarded(): boolean {
  const h = hero;
  if (h.inv > 0 || h.state === "dash" || h.state === "warpStrike" || h.state === "dead" || h.state === "ultimate")
    return true;
  const guard = h.state === "move" && h.move ? MOVES[h.move].guard : 0;
  return !!guard && h.st < guard;
}
