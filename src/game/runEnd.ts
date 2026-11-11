import { track } from "../services/analytics";
import type { RunOutcome, RunResult } from "../types/run";
import { bySourceDamage } from "../utils/runReport";
import { bankCoins } from "./coins";
import { coop } from "./coopHooks";
import { feat } from "./feat";
import { countedOutcome } from "./finale";
import { resetRun } from "./run";
import { runReport } from "./runReport";
import { character, game, hero } from "./state";

/** The end of the last run, for the result screen. */
let last: RunResult = { outcome: "fallen", wave: 0, coins: 0 };
const listeners = new Set<(result: RunResult) => void>();

export const lastRun = (): RunResult => last;

export function onRunEnd(listener: (result: RunResult) => void): void {
  listeners.add(listener);
}

/** Kael fell or cleared the stage: bank the coins, set the stage fresh behind the menu and report how far he got */
export function endRun(fate: RunOutcome): void {
  const room = coop();
  if (room) return room.endRun(fate);
  const outcome = countedOutcome(fate);
  feat({ kind: "runEnd", outcome, wave: game.wave, hero: character.id });
  const result = { outcome, wave: game.wave, coins: bankCoins(), report: runReport() };
  resetRun("");
  hero.inv = 0;
  reportRun(result);
}

/** run_end's fields: how far the run went and, when the run was kept, the level, foes defeated and the source that did the most damage */
function runEndParams(result: RunResult): Record<string, string | number> {
  const params = { hero: character.id, outcome: result.outcome, wave: result.wave, coins: result.coins };
  const { report } = result;
  if (!report) return params;
  const top = bySourceDamage(report.sources)[0]?.id ?? "none";
  return { ...params, level: report.level, kills: report.kills, top };
}

/** show a finished run's result; a co-op room reports its own runs here */
export function reportRun(result: RunResult): void {
  last = result;
  track("run_end", runEndParams(result));
  for (const listener of listeners) listener(last);
}
