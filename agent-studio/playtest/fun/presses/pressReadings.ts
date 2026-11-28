import { median } from "../../utils/median";
import type { MeasureReading } from "../types";
import { MEASURE_PRESSES, MEASURE_RESPONSE, PROBE_STEP_MS } from "./constants";
import type { HeroPresses, PairTrial } from "./types";

const lost = (trial: PairTrial): boolean => trial.firstStarted && !trial.secondStarted && !trial.disturbed;

function lostPairsNote(heroes: readonly HeroPresses[], pairTypes: readonly string[]): string {
  return pairTypes
    .map((pair) => {
      const misses = heroes.flatMap((h) => h.pairs.filter((t) => t.pair === pair && lost(t)));
      const timings = [...new Set(misses.map((t) => t.timing))].join(" and ");
      const who = [...new Set(misses.map((t) => t.hero))];
      const whom = who.length === heroes.length ? "every hero" : who.join(", ");
      return `${pair} lost ${timings} for ${whom}`;
    })
    .join("; ");
}

export function pressReadings(heroes: readonly HeroPresses[], failures: readonly string[]): MeasureReading[] {
  const missing = failures.length > 0 ? `heroes not measured: ${failures.join("; ")}` : "";
  const trials = heroes.flatMap((h) => h.pairs);
  const pairTypes = [...new Set(trials.filter(lost).map((t) => t.pair))];
  const unstarted = trials.filter((t) => !t.firstStarted).map((t) => `${t.hero} ${t.pair} ${t.timing}`);
  const disturbed = trials.filter((t) => t.disturbed).map((t) => `${t.hero} ${t.pair} ${t.timing}`);
  const presses: MeasureReading = {
    id: MEASURE_PRESSES,
    raw: trials.length > 0 ? pairTypes.length : null,
    note: [
      `${heroes.length} heroes, ${trials.length} pair trials`,
      pairTypes.length > 0 ? lostPairsNote(heroes, pairTypes) : "no press lost",
      unstarted.length > 0 ? `first press never started (not counted): ${unstarted.join(", ")}` : "",
      disturbed.length > 0 ? `hero hit by a foe during the retry too (not counted): ${disturbed.join(", ")}` : "",
      missing,
    ]
      .filter(Boolean)
      .join("; "),
  };
  const responses = heroes.flatMap((h) => h.responses);
  const timed = responses.flatMap((r) => (r.ms === null || r.disturbed ? [] : [r.ms]));
  const response: MeasureReading = {
    id: MEASURE_RESPONSE,
    raw: median(timed),
    note: `median of ${timed.length} key-downs over ${heroes.length} heroes, probe step ${PROBE_STEP_MS} ms; ${responses.length - timed.length} showed no change or were disturbed${missing ? `; ${missing}` : ""}`,
  };
  return [presses, response];
}
