import { join } from "node:path";
import { policyByName } from "../../bots/policies";
import { writeJson } from "../../services/files";
import type { JobRunner } from "../types";
import { readings, summarize } from "./analysis";
import { attemptRun } from "./attemptRun";
import { OUTPUT_FILES, PAINT, SKILLED, STAGE_WALL_SHARE } from "./constants";
import { dropArts } from "./dropArts";
import { playStage } from "./playStage";
import type { StageRun } from "./types";

export const runStageRun: JobRunner = async (job, context) => {
  const dir = join(context.outDir, job.kind);
  const minutes = job.sample.minutes;
  const [hero] = job.sample.heroes;
  const [stage] = job.sample.stages;
  if (!minutes || !hero || !stage) {
    throw new Error("A stageRun job needs one hero, one stage and its minutes.");
  }
  const id = `${stage}-${hero}`;
  const result = await attemptRun(context.harness, {
    id,
    hero,
    session: { hero, start: { stage, section: 1, paint: PAINT } },
    wallMinutes: minutes * STAGE_WALL_SHARE,
    play: async (session) => {
      await dropArts(session);
      const outcome = await playStage(session, policyByName(SKILLED), minutes * 60_000);
      return { ...outcome, kind: "stage" as const, stage };
    },
  });
  await writeJson(join(dir, OUTPUT_FILES.runs, `${id}.json`), result);
  const stages: StageRun[] = result.kind === "failed" ? [] : [result];
  const summary = summarize([], stages, result.kind === "failed" ? [id] : []);
  const measured = readings(summary).filter((reading) => job.measures.includes(reading.id));
  await writeJson(join(dir, OUTPUT_FILES.summary), { sample: job.sample, readings: measured, ...summary });
  return { readings: measured, evidence: [] };
};
