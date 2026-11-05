/** how a run ended: Kael fell, he cleared the stage, or a co-op room closed under it */
export type RunOutcome = "fallen" | "clear" | "left";

/** what the result screen shows after a run */
export interface RunResult {
  outcome: RunOutcome;
  wave: number;
  coins: number;
}
