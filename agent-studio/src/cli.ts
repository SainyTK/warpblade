import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runNight } from "./run.ts";
import type { RunOptions } from "./types.ts";
import { studioToday } from "./utils/dates.ts";

const USAGE = `Usage: npm run studio -- run --workdir <checkout> --runs-dir <folder> [--mode dry|live] [--kind auto|big|small] [--date YYYY-MM-DD] [--feedback github|<file.json>]`;

function options(): RunOptions {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      workdir: { type: "string" },
      "runs-dir": { type: "string" },
      mode: { type: "string", default: "dry" },
      kind: { type: "string", default: "auto" },
      date: { type: "string" },
      feedback: { type: "string", default: "github" },
    },
  });
  if (positionals[0] !== "run" || !values.workdir || !values["runs-dir"]) throw new Error(USAGE);
  if (values.mode !== "dry" && values.mode !== "live") throw new Error(`--mode must be dry or live. ${USAGE}`);
  if (!["auto", "big", "small"].includes(values.kind)) throw new Error(`--kind must be auto, big or small. ${USAGE}`);
  return {
    mode: values.mode,
    kind: values.kind as RunOptions["kind"],
    date: values.date ?? studioToday(),
    workdir: resolve(values.workdir),
    runsDir: resolve(values["runs-dir"]),
    feedback: values.feedback === "github" ? "github" : resolve(values.feedback),
  };
}

process.exitCode = await runNight(options());
