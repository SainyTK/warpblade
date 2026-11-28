import { join } from "node:path";
import { writeJson } from "../../services/files";
import type { PolicyName } from "../../types/bot";
import type { JobRunner } from "../types";
import { readings, summarize } from "./analysis";
import { attemptRun } from "./attemptRun";
import { MASH, MEASURE_IDS, OUTPUT_FILES, PAINT, ROOM_WALL_MINUTES, SKILLED } from "./constants";
import { planSampledRooms } from "./planSampledRooms";
import { playRoomRun } from "./playRoomRun";
import { roomRunSpecs } from "./roomRunSpecs";
import type { RoomRun } from "./types";

export const runBossRooms: JobRunner = async (job, context) => {
  const dir = join(context.outDir, job.kind);
  const policies: PolicyName[] = job.measures.includes(MEASURE_IDS.skillGap) ? [SKILLED, MASH] : [SKILLED];
  const plans = await planSampledRooms(context.harness, job.sample.stages);
  const rooms: RoomRun[] = [];
  const failed: string[] = [];
  for (const spec of roomRunSpecs(plans, job.sample.heroes, policies)) {
    const result = await attemptRun(context.harness, {
      id: spec.id,
      hero: spec.hero,
      session: { hero: spec.hero, start: { stage: spec.plan.stage, section: spec.plan.section, paint: PAINT } },
      wallMinutes: ROOM_WALL_MINUTES,
      play: (session) => playRoomRun(session, spec),
    });
    await writeJson(join(dir, OUTPUT_FILES.runs, `${spec.id}.json`), result);
    if (result.kind === "failed") {
      failed.push(spec.id);
    } else {
      rooms.push(result);
    }
  }
  const summary = summarize(rooms, [], failed);
  const measured = readings(summary).filter((reading) => job.measures.includes(reading.id));
  await writeJson(join(dir, OUTPUT_FILES.summary), { sample: job.sample, plans, readings: measured, ...summary });
  return { readings: measured, evidence: [] };
};
