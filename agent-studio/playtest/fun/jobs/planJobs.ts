import type { FunDefinition, JobDefinition } from "../score/types";
import type { FunJob, JobKind, MeasurePick, MeasureSample } from "../types";

function kindOf(definition: FunDefinition, id: string): JobKind {
  const found = Object.entries(definition.jobs).find(([, job]) => job.measures.includes(id));
  if (!found) {
    throw new Error(`No Fun job measures ${id}.`);
  }
  return found[0] as JobKind;
}

function within(job: JobDefinition, sample: MeasureSample): MeasureSample {
  const capped: MeasureSample = {
    heroes: (sample.heroes.length ? sample.heroes : job.default.heroes).slice(0, job.max.heroes),
    stages: (sample.stages.length ? sample.stages : job.default.stages).slice(0, job.max.stages),
  };
  const runs = sample.runs ?? job.default.runs;
  if (runs !== undefined) {
    capped.runs = Math.min(runs, job.max.runs ?? runs);
  }
  const minutes = sample.minutes ?? job.default.minutes;
  if (minutes !== undefined) {
    capped.minutes = Math.min(minutes, job.max.minutes ?? minutes);
  }
  return capped;
}

const union = (a: readonly string[], b: readonly string[]) => [...new Set([...a, ...b])];

const larger = (a: number | undefined, b: number | undefined) =>
  a === undefined ? b : b === undefined ? a : Math.max(a, b);

function merged(job: JobDefinition, a: MeasureSample, b: MeasureSample): MeasureSample {
  return within(job, {
    heroes: union(a.heroes, b.heroes),
    stages: union(a.stages, b.stages),
    runs: larger(a.runs, b.runs),
    minutes: larger(a.minutes, b.minutes),
  });
}

export function planJobs(definition: FunDefinition, picks: readonly MeasurePick[], maxPicks: number): FunJob[] {
  const jobs = new Map<JobKind, FunJob>();
  for (const pick of picks.slice(0, maxPicks)) {
    const kind = kindOf(definition, pick.id);
    const catalogue = definition.jobs[kind];
    const sample = within(catalogue, pick.sample);
    const job = jobs.get(kind);
    jobs.set(
      kind,
      job
        ? { kind, measures: [...job.measures, pick.id], sample: merged(catalogue, job.sample, sample) }
        : { kind, measures: [pick.id], sample },
    );
  }
  return [...jobs.values()];
}

export function allMeasurePicks(definition: FunDefinition): MeasurePick[] {
  return Object.values(definition.jobs).flatMap((job) => job.measures.map((id) => ({ id, sample: job.default })));
}
