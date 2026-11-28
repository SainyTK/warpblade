import { parseArgs } from "node:util";
import { bot } from "./commands/bot";
import { fun } from "./commands/fun";
import { scenario } from "./commands/scenario";
import { smoke } from "./commands/smoke";
import { DEFAULT_MAX_MINUTES, DEFAULT_RUNS } from "./constants/bot";
import { DEFAULT_ROOT } from "./constants/paths";
import { runCleanups } from "./services/cleanup";
import { writeJson } from "./services/files";
import type { FunAction } from "./types/cli";
import type { Report } from "./types/report";

const USAGE = `Usage: npm run playtest -- <command> [flags]
  smoke    [--hero <id>|all]
  bot      [--hero <id>|all] [--runs N] [--policy mash|skilled] [--max-minutes M] [--start-wave N [--start-level L]]
  scenario <file.ts> [--hero <id>] [--viewport WxH] [--max-minutes M] [--start-wave N [--start-level L]]
  fun measure --out-dir <folder> (--picks <picks.json> | --all)
  fun score --readings <readings.json> [--judge <judge.json>]...
  fun refit
Every command takes --root <game repo> and --out <report.json>.`;

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    root: { type: "string", default: DEFAULT_ROOT },
    out: { type: "string" },
    hero: { type: "string" },
    runs: { type: "string", default: String(DEFAULT_RUNS) },
    policy: { type: "string", default: "mash" },
    "max-minutes": { type: "string", default: String(DEFAULT_MAX_MINUTES) },
    viewport: { type: "string" },
    "start-wave": { type: "string" },
    "start-level": { type: "string" },
    "out-dir": { type: "string" },
    readings: { type: "string" },
    picks: { type: "string" },
    all: { type: "boolean", default: false },
    judge: { type: "string", multiple: true },
  },
});

const positiveNumber = (text: string, flag: string): number => {
  const value = Number(text);
  if (!(value > 0)) {
    throw new Error(`--${flag} must be a number above 0, not "${text}".`);
  }
  return value;
};

/** --start-wave and --start-level as a run start, or none */
function runStart() {
  if (!values["start-wave"]) return undefined;
  const wave = Math.floor(positiveNumber(values["start-wave"], "start-wave"));
  const level = values["start-level"] ? Math.floor(positiveNumber(values["start-level"], "start-level")) : 1;
  return { wave, level };
}

const FUN_ACTIONS: readonly string[] = ["measure", "jobs", "score", "refit"];

const isFunAction = (value: string | undefined): value is FunAction =>
  value !== undefined && FUN_ACTIONS.includes(value);

function runCommand(): Promise<Report> {
  const [command, file] = positionals;
  const common = { root: values.root };
  if (command === "smoke") {
    return smoke({ ...common, hero: values.hero ?? "all" });
  }
  if (command === "bot") {
    return bot({
      ...common,
      hero: values.hero ?? "all",
      runs: Math.floor(positiveNumber(values.runs, "runs")),
      policy: values.policy,
      maxMinutes: positiveNumber(values["max-minutes"], "max-minutes"),
      start: runStart(),
    });
  }
  if (command === "scenario" && file) {
    return scenario({
      ...common,
      file,
      hero: values.hero,
      viewport: values.viewport,
      start: runStart(),
      maxMinutes: positiveNumber(values["max-minutes"], "max-minutes"),
    });
  }
  if (command === "fun" && isFunAction(file)) {
    return fun({
      ...common,
      action: file,
      outDir: values["out-dir"],
      picks: values.picks,
      all: values.all ?? false,
      readings: values.readings,
      judges: values.judge ?? [],
    });
  }
  throw new Error(USAGE);
}

async function main(): Promise<void> {
  try {
    const report = await runCommand();
    console.log(JSON.stringify(report, null, 2));
    if (values.out) {
      await writeJson(values.out, report);
    }
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    const report = { command: positionals[0] ?? "", ok: false, error: String(error) };
    console.log(JSON.stringify(report, null, 2));
    if (values.out) {
      await writeJson(values.out, report);
    }
    process.exitCode = 2;
  } finally {
    await runCleanups();
  }
}

await main();
