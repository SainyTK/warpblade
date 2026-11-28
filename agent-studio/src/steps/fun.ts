import { createHash } from "node:crypto";
import { cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { FunDefinition, FunScore, Ledger, MeasurePick, MeasureReading } from "../../playtest/fun/index.ts";
import { allMeasurePicks, scoreFun, withCarryOver } from "../../playtest/fun/index.ts";
import { FUN_DEFINITION, FUN_JUDGES, FUN_LEDGER, FUN_MEASURE_MINUTES } from "../constants.ts";
import { promptFor } from "../prompts.ts";
import { readJson, writeJson } from "../services/files.ts";
import { git, headSha } from "../services/git.ts";
import type { AnalystReport, JudgeReport, Night, QaReport } from "../types.ts";
import { callRole } from "./agent.ts";
import { measureFunBuild } from "./checks.ts";
import { discardChanges } from "./guards.ts";

export interface BuildScore extends FunScore {
  build: string;
  commit: string;
  measured: Record<string, number | null>;
  rubric: Record<string, number[]>;
  carried: string[];
  gut: number[];
  changes: string[];
  evidence: Record<string, string[]>;
  failures: string[];
}

const IMPACTS = ["high", "medium", "low"];

const definitionFile = (night: Night) => join(night.ctx.workdir, FUN_DEFINITION);
const ledgerFile = (night: Night) => join(night.ctx.workdir, FUN_LEDGER);
const readDefinition = (night: Night) => readJson<FunDefinition>(definitionFile(night));
const readLedger = (night: Night) => readJson<Ledger>(ledgerFile(night)).catch((): Ledger => ({ entries: [] }));
const isRubric = (id: string) => id.startsWith("R");

function allIds(definition: FunDefinition): string[] {
  return definition.dimensions.flatMap((d) => [...d.measures.map((m) => m.id), d.rubric.id]);
}

export async function ledgerScore(night: Night): Promise<FunScore & { carried: string[] }> {
  const definition = await readDefinition(night);
  const inputs = withCarryOver(await readLedger(night), definition.version, [], {});
  const score = { ...scoreFun(definition, inputs.readings, inputs.rubric), carried: inputs.carried };
  await writeJson(night.files.funScore("ledger"), score);
  return score;
}

function pickProblems(definition: FunDefinition, report: AnalystReport): string[] {
  const ids = allIds(definition);
  const listed = new Set(report.measures.map((m) => m.id));
  const problems = ids.filter((id) => !listed.has(id)).map((id) => `${id} is not listed with an impact level`);
  problems.push(
    ...report.measures.filter((m) => !IMPACTS.includes(m.impact)).map((m) => `${m.id} has no valid impact`),
  );
  if (report.picks.length === 0) problems.push("no measure is picked");
  if (report.picks.length > definition.budget.maxPicks)
    problems.push(`${report.picks.length} picks; the most is ${definition.budget.maxPicks}`);
  problems.push(...report.picks.filter((p) => !ids.includes(p.id)).map((p) => `${p.id} is not a Fun measure`));
  return problems;
}

export async function pickMeasures(night: Night): Promise<MeasurePick[]> {
  const { files, ctx } = night;
  const definition = await readDefinition(night);
  const seeded = (await readLedger(night)).entries.some((entry) => entry.definitionVersion === definition.version);
  if (!seeded) {
    const all = allMeasurePicks(definition);
    console.log(
      `[studio] the ledger has no readings for Fun definition ${definition.version}; tonight measures everything`,
    );
    await writeJson(files.funPicks, all);
    return all;
  }
  const inputs = {
    "The Fun definition (measures, jobs with default samples and caps, budget)": definitionFile(night),
    "The current Fun score from the ledger (latest reading of every measure)": files.funScore("ledger"),
    "Fun ledger": ledgerFile(night),
    "Tonight's plan": files.plan,
    "Commits since the last release": files.commits,
  };
  let feedback = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = await promptFor("analyst", ctx, inputs, feedback);
    const { output } = await callRole<AnalystReport>(night, {
      role: "analyst",
      prompt,
      label: attempt ? "analyst-fix" : "analyst",
    });
    const problems = pickProblems(definition, output);
    if (!problems.length) {
      await writeJson(files.funAnalysis, output);
      await writeJson(files.funPicks, output.picks);
      return output.picks;
    }
    feedback = `Your last answer had these problems. Answer again:\n${problems.map((p) => `- ${p}`).join("\n")}`;
  }
  throw new Error(`The Fun analyst's picks are still invalid after a second attempt: ${feedback}`);
}

function rubricLevels(judges: JudgeReport[]): Record<string, number[]> {
  const levels: Record<string, number[]> = {};
  for (const judge of judges) {
    for (const [id, level] of Object.entries(judge.levels)) levels[id] = [...(levels[id] ?? []), level];
  }
  return levels;
}

function rubricEvidence(judges: JudgeReport[]): Record<string, string[]> {
  const evidence: Record<string, string[]> = {};
  for (const judge of judges) {
    for (const [id, text] of Object.entries(judge.evidence)) evidence[id] = [...(evidence[id] ?? []), text];
  }
  return evidence;
}

async function judge(night: Night, build: string, items: string[], compareWith: string | null): Promise<JudgeReport[]> {
  const { files, ctx } = night;
  const inputs: Record<string, string> = {
    "The Fun definition (dimensions, measures and rubric anchors)": definitionFile(night),
    "This build's measurement (readings, evidence list, CPU)": join(files.fun(build), "measurement.json"),
    "This build's evidence folder": files.fun(build),
  };
  if (compareWith) {
    inputs["The base build's evidence folder, for side-by-side comparison"] = files.fun(compareWith);
    inputs["The base build's Fun score with every judge's levels and evidence"] = files.funScore(compareWith);
  }
  const extra = `Score only these rubric items tonight: ${items.join(", ")}.`;
  const prompt = await promptFor("judge", ctx, inputs, extra);
  const head = await headSha(ctx.workdir);
  const calls = Array.from({ length: FUN_JUDGES }, (_, i) =>
    callRole<JudgeReport>(night, { role: "judge", prompt, label: `judge-${build}-${i + 1}` }),
  );
  const judges = (await Promise.all(calls)).map((call) => call.output);
  await discardChanges(night);
  if ((await headSha(ctx.workdir)) !== head) throw new Error("A Fun judge committed to the branch");
  const scored = judges.map((report) => ({
    ...report,
    levels: Object.fromEntries(Object.entries(report.levels).filter(([id]) => items.includes(id))),
  }));
  await Promise.all(scored.map((report, i) => writeJson(files.funJudge(build, i + 1), report)));
  return scored;
}

async function measuredStateKey(night: Night): Promise<string> {
  const cwd = night.ctx.workdir;
  const root = (await git(cwd, "ls-tree", "HEAD")).split("\n").filter((line) => !line.endsWith("\tagent-studio"));
  const harness = await git(cwd, "rev-parse", "HEAD:agent-studio/playtest", `HEAD:${FUN_DEFINITION}`);
  const picks = JSON.stringify(await readJson<MeasurePick[]>(night.files.funPicks));
  return createHash("sha256")
    .update([...root, harness, picks].join("\n"))
    .digest("hex")
    .slice(0, 16);
}

const cacheDir = (night: Night, key: string) => join(dirname(night.ctx.runDir), ".fun-cache", key);

async function reuseMeasurement(night: Night, build: string, key: string): Promise<boolean> {
  const cached = await readJson<unknown>(join(cacheDir(night, key), "measurement.json")).catch(() => null);
  if (!cached) return false;
  await cp(cacheDir(night, key), night.files.fun(build), { recursive: true });
  console.log(
    `[studio] Fun measurement of ${build} reused from an earlier night with the same code and picks (${key})`,
  );
  return true;
}

export async function scoreBuild(night: Night, build: string, compareWith: string | null): Promise<BuildScore> {
  const { files, ctx } = night;
  const definition = await readDefinition(night);
  const picks = await readJson<MeasurePick[]>(files.funPicks);
  const key = await measuredStateKey(night);
  const failures: string[] = [];
  if (!(await reuseMeasurement(night, build, key))) {
    const all = picks.length > definition.budget.maxPicks;
    const ok = await measureFunBuild(night, all ? null : files.funPicks, files.fun(build), FUN_MEASURE_MINUTES);
    if (ok) await cp(files.fun(build), cacheDir(night, key), { recursive: true });
    else failures.push(`fun measure did not finish cleanly; see ${files.checksLog}`);
  }
  const fresh = await readJson<MeasureReading[]>(files.funReadings(build)).catch((): MeasureReading[] => []);
  const items = picks.map((p) => p.id).filter(isRubric);
  const judges = items.length ? await judge(night, build, items, compareWith) : [];
  const levels = rubricLevels(judges);
  const inputs = withCarryOver(await readLedger(night), definition.version, fresh, levels);
  const score: BuildScore = {
    ...scoreFun(definition, inputs.readings, inputs.rubric),
    build,
    commit: await headSha(ctx.workdir),
    measured: Object.fromEntries(fresh.map((r) => [r.id, r.raw])),
    rubric: levels,
    carried: inputs.carried,
    gut: judges.map((j) => j.gut),
    changes: judges.flatMap((j) => j.changes),
    evidence: rubricEvidence(judges),
    failures,
  };
  await writeJson(files.funScore(build), score);
  return score;
}

export function funRegression(
  base: BuildScore,
  patch: BuildScore,
  basePath: string,
  patchPath: string,
): QaReport | null {
  if (patch.fun >= base.fun) return null;
  const issues = Object.entries(patch.dimensions)
    .filter(([id, value]) => value < (base.dimensions[id] ?? 0))
    .map(([id, value]) => ({
      severity: "major" as const,
      description: `The patch lowers Fun from ${base.fun} to ${patch.fun}; ${id} fell from ${base.dimensions[id]} to ${value}.`,
      reproduce: `Compare the measure parts and the judges' evidence in ${basePath} and ${patchPath}.`,
    }));
  return { verdict: "fail", checks: [], issues };
}

export async function recordFun(night: Night, base: BuildScore, patch: BuildScore): Promise<void> {
  const ledger = await readLedger(night);
  ledger.entries.push({
    date: night.ctx.date,
    build: `${night.ctx.version} (${patch.commit.slice(0, 8)}), base ${base.fun} at ${base.commit.slice(0, 8)}`,
    definitionVersion: patch.definitionVersion,
    studio: { fun: patch.fun, dimensions: patch.dimensions },
    readings: patch.measured,
    rubric: patch.rubric,
    owner: null,
  });
  await writeJson(ledgerFile(night), ledger);
}
