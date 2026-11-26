import type { StageGrade } from "./run";
/** the best this browser has done in solo runs */
export interface RunRecords {
  /** the fastest run time, in seconds, to clear each wave: index 0 is wave 1; its length is the most waves cleared */
  splits: number[];
}

/** a number of waves cleared and the run time it took */
export interface WaveClear {
  waves: number;
  seconds: number;
}

export interface CampaignRecords {
  mostSealed: number;
  fastestClear: number | null;
  bestGrade: StageGrade | null;
  mostDamage: number;
  highestLevel: number;
}

export type CampaignRecordKey = keyof CampaignRecords;

export interface CampaignRun {
  sealed: number;
  cleared: boolean;
  seconds: number;
  grade: StageGrade;
  damage: number;
  level: number;
}
