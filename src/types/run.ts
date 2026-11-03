/** how a run ended: Kael fell, or he cleared the stage */
export type RunOutcome = "fallen" | "clear";

/** what the result screen shows after a run */
export interface RunResult {
  outcome: RunOutcome;
  wave: number;
  coins: number;
}
