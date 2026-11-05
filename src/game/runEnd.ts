import type { RunOutcome, RunResult } from "../types/run";
import { bankCoins } from "./coins";
import { coop } from "./coopHooks";
import { resetRun } from "./run";
import { game, hero } from "./state";

/** The end of the last run, for the result screen. */
let last: RunResult = { outcome: "fallen", wave: 0, coins: 0 };
const listeners = new Set<(result: RunResult) => void>();

export const lastRun = (): RunResult => last;

export function onRunEnd(listener: (result: RunResult) => void): void {
  listeners.add(listener);
}

/** Kael fell or cleared the stage: bank the coins, set the stage fresh behind the menu and report how far he got */
export function endRun(outcome: RunOutcome): void {
  const room = coop();
  if (room) return room.endRun(outcome);
  const result = { outcome, wave: game.wave, coins: bankCoins() };
  resetRun("");
  hero.inv = 0;
  reportRun(result);
}

/** show a finished run's result; a co-op room reports its own runs here */
export function reportRun(result: RunResult): void {
  last = result;
  for (const listener of listeners) listener(last);
}
