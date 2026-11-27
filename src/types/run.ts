import type { SourceId } from "./build";
import type { StageId } from "./campaign";
import type { StageRecordKey } from "./records";

/**
 * how a run ended: the hero fell, cleared the stage (also when they fell to what comes after its last wave), defeated
 * that too, or a co-op room closed under the run
 */
export type RunOutcome = "fallen" | "clear" | "beyond" | "left";

/** one source's damage over a run */
export interface SourceResult {
  id: SourceId;
  damage: number;
  /** seconds the hero held the source */
  seconds: number;
  /** a skill's level at the end of the run; the hero's own sources have none */
  level?: number;
  evolved?: boolean;
}

/** what one hero did in a run, for the end of run screen */
export interface RunReport {
  /** the hero's character id */
  hero: string;
  /** the run clock at the end */
  seconds: number;
  /** waves cleared */
  cleared: number;
  level: number;
  kills: number;
  ultimate: string;
  sources: SourceResult[];
}

export type StageGrade = "E" | "D" | "C" | "B" | "A" | "S";

export interface StageResult {
  stage: StageId;
  hyper: boolean;
  cleared: boolean;
  grade: StageGrade;
  damage: number;
  where: string;
  miniDefeated: boolean;
  beaten: readonly StageRecordKey[];
}

export type RunResult = { outcome: RunOutcome; coins: number } & (
  | { stage: StageResult; report: RunReport; wave?: never }
  | { stage?: never; report?: RunReport; wave: number }
);
