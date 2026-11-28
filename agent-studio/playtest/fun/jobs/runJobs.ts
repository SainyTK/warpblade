import { join } from "node:path";
import { launchHarness } from "../../session/harness";
import { runPool } from "../../utils/runPool";
import type { EvidenceItem, FunJob, MeasureReading } from "../types";
import { JOB_RUNNERS } from "./runners";

export interface JobsOutcome {
  readings: MeasureReading[];
  evidence: EvidenceItem[];
  failures: string[];
}

const jobFolder = (job: FunJob, index: number) => `${index + 1}-${job.kind}`;

export async function runJobs(root: string, outDir: string, jobs: FunJob[], maxParallel: number): Promise<JobsOutcome> {
  const harness = await launchHarness(root);
  const failures: string[] = [];
  try {
    const results = await runPool(
      jobs.map((job, index) => ({ job, index })),
      maxParallel,
      async ({ job, index }) => {
        const folder = jobFolder(job, index);
        try {
          const result = await JOB_RUNNERS[job.kind](job, { harness, root, outDir: join(outDir, folder) });
          return {
            readings: result.readings,
            evidence: result.evidence.map((item) => ({ ...item, file: join(folder, item.file) })),
          };
        } catch (error) {
          failures.push(
            `${folder} (${job.measures.join(", ")}): ${error instanceof Error ? error.message : String(error)}`,
          );
          return { readings: [], evidence: [] };
        }
      },
    );
    return {
      readings: results.flatMap((result) => result.readings),
      evidence: results.flatMap((result) => result.evidence),
      failures,
    };
  } finally {
    await harness.close();
  }
}
