import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { join, resolve } from "node:path";
import { funDefinitionPath, funLedgerPath } from "../constants/paths";
import type {
  FunDefinition,
  FunJob,
  FunMeasurement,
  JobsOutcome,
  JudgeLevels,
  Ledger,
  MeasurePick,
  MeasureReading,
} from "../fun";
import { allMeasurePicks, planJobs, refitWeights, runJobs, scoreFun, withCarryOver } from "../fun";
import { onCleanup } from "../services/cleanup";
import { endTree, governCpu } from "../services/cpuGovernor";
import { readJson, writeJson } from "../services/files";
import { acquireMeasureLock } from "../services/measureLock";
import type { FunFlags } from "../types/cli";
import type { FunReport } from "../types/report";
import { secondsSince } from "../utils/elapsed";

interface ActionResult {
  result: unknown;
  failures: string[];
}

const CLI_PATH = resolve(import.meta.dirname, "..", "cli.ts");
const FILES = {
  jobs: "jobs.json",
  outcome: "outcome.json",
  log: "jobs.log",
  measurement: "measurement.json",
  readings: "readings.json",
};

const requireOutDir = (flags: FunFlags): string => {
  if (!flags.outDir) {
    throw new Error(`fun ${flags.action} needs --out-dir <folder>.`);
  }
  return resolve(flags.outDir);
};

async function picksFor(flags: FunFlags, definition: FunDefinition): Promise<MeasurePick[]> {
  if (flags.all) {
    return allMeasurePicks(definition);
  }
  if (!flags.picks) {
    throw new Error("fun measure needs --picks <picks.json> or --all.");
  }
  return readJson<MeasurePick[]>(flags.picks);
}

interface ChildRun {
  pid: number;
  exited: Promise<number | null>;
}

function startChild(root: string, outDir: string): Promise<ChildRun> {
  const log = createWriteStream(join(outDir, FILES.log));
  const args = [...process.execArgv, CLI_PATH, "fun", "jobs", "--root", root, "--out-dir", outDir];
  const child = spawn(process.execPath, args, { stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  const exited = new Promise<number | null>((done) => child.on("exit", (code) => done(code)));
  return new Promise((started, fail) => {
    child.on("error", fail);
    child.on("spawn", () => started({ pid: child.pid ?? 0, exited }));
  });
}

async function measure(flags: FunFlags): Promise<ActionResult> {
  const outDir = requireOutDir(flags);
  await mkdir(outDir, { recursive: true });
  const definition = await readJson<FunDefinition>(funDefinitionPath(flags.root));
  const maxPicks = flags.all ? Number.POSITIVE_INFINITY : definition.budget.maxPicks;
  const planned = planJobs(definition, await picksFor(flags, definition), maxPicks);
  await writeJson(join(outDir, FILES.jobs), planned);
  const release = await acquireMeasureLock();
  try {
    const child = await startChild(flags.root, outDir);
    const forget = onCleanup(() => endTree(child.pid));
    const governor = governCpu(child.pid, availableParallelism() * definition.budget.cpuShare);
    const code = await child.exited;
    const cpu = await governor.stop();
    forget();
    const outcome = await readJson<JobsOutcome>(join(outDir, FILES.outcome)).catch(
      (): JobsOutcome => ({
        readings: [],
        evidence: [],
        failures: [`the job process exited with ${code}; see ${FILES.log}`],
      }),
    );
    const measurement: FunMeasurement = { jobs: planned, ...outcome, cpu };
    await writeJson(join(outDir, FILES.measurement), measurement);
    await writeJson(join(outDir, FILES.readings), outcome.readings);
    return { result: measurement, failures: outcome.failures };
  } finally {
    await release();
  }
}

async function jobs(flags: FunFlags): Promise<ActionResult> {
  const outDir = requireOutDir(flags);
  const definition = await readJson<FunDefinition>(funDefinitionPath(flags.root));
  const planned = await readJson<FunJob[]>(join(outDir, FILES.jobs));
  const outcome = await runJobs(flags.root, outDir, planned, definition.budget.maxParallelJobs);
  await writeJson(join(outDir, FILES.outcome), outcome);
  return { result: { jobs: planned.length }, failures: outcome.failures };
}

function rubricLevels(judges: JudgeLevels[]): Record<string, number[]> {
  const levels: Record<string, number[]> = {};
  for (const judge of judges) {
    for (const [id, level] of Object.entries(judge.levels)) {
      levels[id] = [...(levels[id] ?? []), level];
    }
  }
  return levels;
}

async function score(flags: FunFlags): Promise<ActionResult> {
  if (!flags.readings) {
    throw new Error("fun score needs --readings <readings.json>.");
  }
  const definition = await readJson<FunDefinition>(funDefinitionPath(flags.root));
  const ledger = await readJson<Ledger>(funLedgerPath(flags.root)).catch((): Ledger => ({ entries: [] }));
  const readings = await readJson<MeasureReading[]>(flags.readings);
  const judges = await Promise.all(flags.judges.map((file) => readJson<JudgeLevels>(file)));
  const inputs = withCarryOver(ledger, definition.version, readings, rubricLevels(judges));
  return {
    result: { ...scoreFun(definition, inputs.readings, inputs.rubric), carried: inputs.carried },
    failures: [],
  };
}

async function refit(flags: FunFlags): Promise<ActionResult> {
  const path = funDefinitionPath(flags.root);
  const definition = await readJson<FunDefinition & Record<string, unknown>>(path);
  const ledger = await readJson<Ledger>(funLedgerPath(flags.root));
  const { weights, samples } = refitWeights(definition, ledger);
  definition.dimensions.forEach((dimension, i) => {
    dimension.weight = weights[i];
  });
  await writeJson(path, definition);
  const byDimension = Object.fromEntries(definition.dimensions.map((d) => [d.id, d.weight]));
  return { result: { samples, weights: byDimension }, failures: [] };
}

const ACTIONS = { measure, jobs, score, refit };

export async function fun(flags: FunFlags): Promise<FunReport> {
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const { result, failures } = await ACTIONS[flags.action](flags);
  return {
    command: "fun",
    action: flags.action,
    ok: failures.length === 0,
    root: flags.root,
    startedAt,
    wallSeconds: secondsSince(started),
    pageErrors: [],
    result,
    failures,
  };
}
