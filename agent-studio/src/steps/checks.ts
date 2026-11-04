import { join } from "node:path";
import { BASELINE_BOT_RUNS } from "../constants.ts";
import { exec } from "../services/shell.ts";
import type { Night } from "../types.ts";

export interface CheckResult {
  name: string;
  ok: boolean;
}

const MINUTE = 60_000;

async function npm(night: Night, cwd: string, args: string[], minutes: number): Promise<boolean> {
  const result = await exec("npm", args, { cwd, logPath: night.files.checksLog, timeoutMs: minutes * MINUTE });
  return result.code === 0;
}

const studioDir = (night: Night) => join(night.ctx.workdir, "agent-studio");

/** install the game's and the studio's packages exactly as locked */
export async function install(night: Night): Promise<void> {
  for (const cwd of [night.ctx.workdir, studioDir(night)]) {
    if (!(await npm(night, cwd, ["ci", "--no-audit", "--no-fund"], 10))) {
      throw new Error(`npm ci failed in ${cwd}; see ${night.files.checksLog}`);
    }
  }
}

/** typecheck, lint, build and the playtest smoke check for every hero */
export async function runChecks(night: Night): Promise<CheckResult[]> {
  const root = night.ctx.workdir;
  return [
    { name: "typecheck", ok: await npm(night, root, ["run", "typecheck"], 5) },
    { name: "lint", ok: await npm(night, root, ["run", "lint"], 5) },
    { name: "build", ok: await npm(night, root, ["run", "build"], 10) },
    { name: "smoke", ok: await npm(night, studioDir(night), ["run", "playtest", "--", "smoke", "--hero", "all"], 15) },
  ];
}

export const failed = (checks: CheckResult[]) => checks.filter((c) => !c.ok).map((c) => c.name);

/** bot runs on the base version, so the director and QA can compare difficulty */
export async function baseline(night: Night): Promise<void> {
  for (const policy of ["mash", "skilled"]) {
    const out = join(night.files.baseline, `bot-${policy}.json`);
    const args = [
      "run",
      "playtest",
      "--",
      "bot",
      "--hero",
      "all",
      "--runs",
      String(BASELINE_BOT_RUNS),
      "--policy",
      policy,
      "--out",
      out,
    ];
    await npm(night, studioDir(night), args, 40);
  }
  const smoke = join(night.files.baseline, "smoke.json");
  await npm(night, studioDir(night), ["run", "playtest", "--", "smoke", "--hero", "all", "--out", smoke], 15);
}
