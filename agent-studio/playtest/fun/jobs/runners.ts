import { runEvidence } from "../evidence";
import { runGrowth } from "../growth";
import { runPresses } from "../presses";
import { runBossRooms, runStageRun } from "../rooms";
import type { JobKind, JobRunner } from "../types";

export const JOB_RUNNERS: Record<JobKind, JobRunner> = {
  presses: runPresses,
  bossRooms: runBossRooms,
  stageRun: runStageRun,
  growth: runGrowth,
  evidence: runEvidence,
};
