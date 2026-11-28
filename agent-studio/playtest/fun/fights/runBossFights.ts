import { join } from "node:path";
import { writeJson } from "../../services/files";
import type { PolicyName } from "../../types/bot";
import type { JobRunner } from "../types";
import { readings, summarize } from "./analysis";
import { attemptRun } from "./attemptRun";
import { FIGHT_WALL_MINUTES, MASH, MEASURE_IDS, OUTPUT_FILES, PAINT, SKILLED } from "./constants";
import { fightRunSpecs } from "./fightRunSpecs";
import { planSampledFights } from "./planSampledFights";
import { playFightRun } from "./playFightRun";
import type { FightRun } from "./types";

export const runBossFights: JobRunner = async (job, context) => {
  const dir = join(context.outDir, job.kind);
  const policies: PolicyName[] = job.measures.includes(MEASURE_IDS.skillGap) ? [SKILLED, MASH] : [SKILLED];
  const plans = await planSampledFights(context.harness, job.sample.stages);
  const fights: FightRun[] = [];
  const failed: string[] = [];
  for (const spec of fightRunSpecs(plans, job.sample.heroes, policies)) {
    const result = await attemptRun(context.harness, {
      id: spec.id,
      hero: spec.hero,
      session: { hero: spec.hero, start: { stage: spec.plan.stage, section: spec.plan.section, paint: PAINT } },
      wallMinutes: FIGHT_WALL_MINUTES,
      play: (session) => playFightRun(session, spec),
    });
    await writeJson(join(dir, OUTPUT_FILES.runs, `${spec.id}.json`), result);
    if (result.kind === "failed") {
      failed.push(spec.id);
    } else {
      fights.push(result);
    }
  }
  const summary = summarize(fights, [], failed);
  const measured = readings(summary).filter((reading) => job.measures.includes(reading.id));
  await writeJson(join(dir, OUTPUT_FILES.summary), { sample: job.sample, plans, readings: measured, ...summary });
  return { readings: measured, evidence: [] };
};
