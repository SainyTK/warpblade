import type { StageGrade } from "./run";
/** the best this browser has done in solo runs */
export interface RunRecords {
  /** the fastest run time, in seconds, to clear each wave: index 0 is wave 1; its length is the most waves cleared */
  splits: number[];
}

export interface StageBest {
  clears: number;
  fastestClear: number | null;
  bestGrade: StageGrade | null;
  mostDamage: number;
  highestLevel: number;
}

export type StageRecordKey = Exclude<keyof StageBest, "clears">;

export type StageRecords = Readonly<Record<string, StageBest>>;

export interface StageRun {
  key: string;
  cleared: boolean;
  seconds: number;
  grade: StageGrade;
  damage: number;
  level: number;
}
