import { join } from "node:path";
import { writeJson } from "../../services/files";
import type { JobRunner } from "../types";
import { benchHeroWithRetry } from "./benchHeroWithRetry";
import { RAW_FILE } from "./constants";
import { pressReadings } from "./pressReadings";
import type { HeroBench } from "./types";

export const runPresses: JobRunner = async (job, context) => {
  const benches: HeroBench[] = [];
  for (const hero of job.sample.heroes) {
    benches.push(await benchHeroWithRetry(context.harness, hero));
  }
  const results = benches.flatMap((bench) => (bench.presses ? [bench.presses] : []));
  const failures = benches.flatMap((bench) => (bench.presses ? [] : [`${bench.hero}: ${bench.failure}`]));
  const readings = pressReadings(results, failures).filter((reading) => job.measures.includes(reading.id));
  await writeJson(join(context.outDir, RAW_FILE), { job, readings, heroes: results, failures });
  return { readings, evidence: [] };
};
