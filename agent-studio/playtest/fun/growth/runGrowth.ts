import type { FunJob, JobContext, JobResult, JobRunner, MeasureReading } from "../types";
import { runWorker } from "./services/runWorker";
import type { GrowthSample } from "./types/model";

function growthSample(job: FunJob, context: JobContext): GrowthSample {
  if (job.kind !== "growth") {
    throw new Error(`the growth runner got a ${job.kind} job`);
  }
  const { heroes, runs } = job.sample;
  if (runs === undefined || runs < 1 || heroes.length === 0) {
    throw new Error("a growth job needs at least one hero and one run");
  }
  return { root: context.root, outDir: context.outDir, measures: job.measures, heroes, runs };
}

export const runGrowth: JobRunner = async (job, context): Promise<JobResult> => {
  const sample = growthSample(job, context);
  const readings = await runWorker<GrowthSample, MeasureReading[]>(new URL("./worker.ts", import.meta.url), sample);
  return { readings, evidence: [] };
};
