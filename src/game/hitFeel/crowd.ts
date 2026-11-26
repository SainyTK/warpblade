import { HIT_CROWD } from "../../constants/hitFeel";
import { game } from "../state";

let prior = 0;
let now = 0;
let at = 0;

export function countCrowd(): { prior: number; now: number } {
  if (game.t !== at) {
    prior = (prior + now) * 0.5 ** (Math.max(0, game.t - at) / HIT_CROWD.halfLife);
    now = 0;
    at = game.t;
  }
  now++;
  return { prior, now };
}
