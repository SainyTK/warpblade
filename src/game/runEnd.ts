import { FINALE } from "../constants/waves";
import { track } from "../services/analytics";
import type { RunOutcome, RunResult } from "../types/run";
import { bySourceDamage } from "../utils/runReport";
import { facingFinale, isAdventure } from "./adventure";
import { bankCoins } from "./coins";
import { coop } from "./coopHooks";
import { feat } from "./feat";
import { countedOutcome } from "./finale";
import { resetRun } from "./run";
import { runReport, stageResult } from "./runReport";
import { startRun } from "./startRun";
import { character, game, hero } from "./state";
import { isTraining } from "./training";

/** The end of the last run, for the result screen. */
let last: RunResult = { outcome: "fallen", wave: 0, coins: 0 };
const listeners = new Set<(result: RunResult) => void>();

export const lastRun = (): RunResult => last;

export function onRunEnd(listener: (result: RunResult) => void): void {
  listeners.add(listener);
}

export function endRun(fate: RunOutcome): void {
  const room = coop();
  if (room) return room.endRun(fate);
  if (isTraining()) return startRun("Rise again");
  const adventure = isAdventure();
  const outcome = adventure ? (fate === "fallen" && facingFinale(FINALE.foe) ? "clear" : fate) : countedOutcome(fate);
  feat({ kind: "runEnd", outcome, wave: game.wave, hero: character.id });
  const report = runReport();
  const coins = bankCoins();
  const result: RunResult = adventure
    ? { outcome, stage: stageResult(report, outcome), coins, report }
    : { outcome, wave: game.wave, coins, report };
  resetRun("");
  hero.inv = 0;
  reportRun(result);
}

function runEndParams(result: RunResult): Record<string, string | number> {
  const { outcome, coins, report, stage } = result;
  const params = { hero: report?.hero ?? character.id, outcome, coins };
  const run: Record<string, string | number> = stage
    ? { grade: stage.grade, bosses: stage.bossesDefeated, distance: stage.distance, damage: stage.damage }
    : { wave: result.wave };
  if (!report) return { ...params, ...run };
  const top = bySourceDamage(report.sources)[0]?.id ?? "none";
  return { ...params, ...run, level: report.level, kills: report.kills, top };
}

/** show a finished run's result; a co-op room reports its own runs here */
export function reportRun(result: RunResult): void {
  last = result;
  track("run_end", runEndParams(result));
  for (const listener of listeners) listener(last);
}
