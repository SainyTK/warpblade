import type { RunOutcome } from "../types/run";
import { game } from "./state";

/** how a run's end is counted: a fall to what comes after the last wave's boss is still a cleared stage */
export const countedOutcome = (outcome: RunOutcome): RunOutcome =>
  outcome === "fallen" && game.finale === "beyond" ? "clear" : outcome;
