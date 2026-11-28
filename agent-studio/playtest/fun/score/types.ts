import type { JobKind, MeasureSample } from "../types";

export type BandScale = "linear" | "log";

export interface Band {
  scale: BandScale;
  points: [number, number][];
}

export interface MeasureDefinition {
  id: string;
  name: string;
  band: Band;
}

export interface DimensionDefinition {
  id: string;
  name: string;
  weight: number;
  measures: MeasureDefinition[];
  rubric: { id: string };
}

export interface JobDefinition {
  measures: string[];
  default: MeasureSample;
  max: { heroes: number; stages: number; runs?: number; minutes?: number };
}

export interface FunDefinition {
  version: number;
  dimensions: DimensionDefinition[];
  calibration: { ridge: number };
  budget: { maxPicks: number; maxParallelJobs: number; cpuShare: number };
  jobs: Record<JobKind, JobDefinition>;
}

export interface PartScore {
  raw: number | null;
  score: number;
}

export interface FunScore {
  definitionVersion: number;
  fun: number;
  dimensions: Record<string, number>;
  parts: Record<string, PartScore>;
  missing: string[];
}

export interface OwnerScore {
  date: string;
  fun: number | null;
  verdict: "more" | "same" | "less" | "agrees" | null;
  reasons: string[];
}

export interface LedgerEntry {
  date: string;
  build: string;
  definitionVersion: number;
  studio: { fun: number; dimensions: Record<string, number> };
  readings?: Record<string, number | null>;
  rubric?: Record<string, number[]>;
  owner: OwnerScore | null;
}

export interface Ledger {
  entries: LedgerEntry[];
}
