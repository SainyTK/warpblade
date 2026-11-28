import type { Harness } from "../session/harness";

export interface MeasureReading {
  id: string;
  raw: number | null;
  note: string;
}

export interface EvidenceItem {
  file: string;
  shows: string;
  assisted: boolean;
}

export type JobKind = "presses" | "bossFights" | "stageRun" | "growth" | "evidence";

export interface MeasureSample {
  heroes: string[];
  stages: string[];
  runs?: number;
  minutes?: number;
}

export interface FunJob {
  kind: JobKind;
  measures: string[];
  sample: MeasureSample;
}

export interface JobContext {
  harness: Harness;
  root: string;
  outDir: string;
}

export interface JobResult {
  readings: MeasureReading[];
  evidence: EvidenceItem[];
}

export type JobRunner = (job: FunJob, context: JobContext) => Promise<JobResult>;

export interface MeasurePick {
  id: string;
  sample: MeasureSample;
}

export interface JudgeLevels {
  levels: Record<string, number>;
}

export interface FunMeasurement {
  jobs: FunJob[];
  readings: MeasureReading[];
  evidence: EvidenceItem[];
  failures: string[];
  cpu: { budgetCores: number; averageCores: number; peakCores: number; pausedSeconds: number };
}
