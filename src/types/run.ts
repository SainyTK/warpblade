import type { SourceId } from "./build";
import type { UltimateId } from "./skill";

/** how a run ended: Kael fell, he cleared the stage, or a co-op room closed under it */
export type RunOutcome = "fallen" | "clear" | "left";

/** one source's damage over a run */
export interface SourceResult {
  id: SourceId;
  damage: number;
  /** seconds the hero held the source */
  seconds: number;
  /** a relic's level at the end of the run; hero sources have none */
  level?: number;
  evolved?: boolean;
}

/** what one hero did in a run, for the end of run screen */
export interface RunReport {
  /** the hero's character id */
  hero: string;
  /** seconds survived */
  seconds: number;
  level: number;
  kills: number;
  ultimate: UltimateId | null;
  sources: SourceResult[];
}

/** what the result screen shows after a run */
export interface RunResult {
  outcome: RunOutcome;
  wave: number;
  coins: number;
  /** missing when a guest leaves a room mid-run, since the host kept the run */
  report?: RunReport;
}
