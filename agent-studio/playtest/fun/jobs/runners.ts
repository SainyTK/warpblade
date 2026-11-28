import { runEvidence } from "../evidence";
import { runBossFights, runStageRun } from "../fights";
import { runGrowth } from "../growth";
import { runPresses } from "../presses";
import type { JobKind, JobRunner } from "../types";

export const JOB_RUNNERS: Record<JobKind, JobRunner> = {
  presses: runPresses,
  bossFights: runBossFights,
  stageRun: runStageRun,
  growth: runGrowth,
  evidence: runEvidence,
};
