import { recordClear } from "../store/records";
import { minutesSeconds } from "../utils/runReport";
import { coop } from "./coopHooks";
import { game } from "./state";

/**
 * The wave in play is cleared: count it with the run time, keep it in the solo records, and return the clear time for
 * the banner, marked when it is the fastest clear of that wave yet. A co-op run keeps no records.
 */
export function clearWave(): string {
  game.cleared = game.wave;
  game.clearedAt = game.clock;
  const best = !coop() && recordClear(game.wave, game.clock);
  return `${minutesSeconds(game.clock)}${best ? "  New best" : ""}`;
}
