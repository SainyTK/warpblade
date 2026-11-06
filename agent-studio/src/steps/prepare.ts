import { access, mkdir, readdir, rename } from "node:fs/promises";
import { join } from "node:path";
import type { Patch } from "../../../src/types/patch.ts";
import { compareVersions } from "../../../src/utils/compareVersions.ts";
import { BRANCH_PREFIX, HERO_ROSTER_TARGET } from "../constants.ts";
import { runFiles } from "../runFiles.ts";
import { readJson, writeJson, writeText } from "../services/files.ts";
import { dayWorkIn, dirtyFiles, git, headSha, lastTag } from "../services/git.ts";
import { heroCount } from "../services/roster.ts";
import type { Night, RunOptions } from "../types.ts";
import { nextVersion, patchKindFor, type ShippedPatch } from "../utils/cadence.ts";

const PATCH_DIR = join("src", "content", "patches");

/** every patch already in the checkout, oldest first */
export async function shippedPatches(workdir: string): Promise<ShippedPatch[]> {
  const names = (await readdir(join(workdir, PATCH_DIR))).filter((n) => n.endsWith(".json"));
  const patches = await Promise.all(names.map((n) => readJson<Patch>(join(workdir, PATCH_DIR, n))));
  return patches
    .map((p) => ({ version: p.version, kind: p.kind, date: p.date }))
    .sort((a, b) => compareVersions(a.version, b.version));
}

/** decide tonight's patch, start its branch and write the run context; null when a patch already shipped today */
export async function prepare(options: RunOptions): Promise<Night | null> {
  const { workdir } = options;
  const dirty = await dirtyFiles(workdir);
  if (dirty.length) throw new Error(`The checkout ${workdir} has uncommitted changes: ${dirty.slice(0, 5).join(", ")}`);
  const shipped = await shippedPatches(workdir);
  if (shipped.some((p) => p.date === options.date)) {
    console.log(`[studio] a patch for ${options.date} already exists; nothing to do`);
    return null;
  }
  const tag = await lastTag(workdir);
  const range = tag ? `${tag}..HEAD` : "-30";
  const dayWork = await dayWorkIn(workdir, range);
  const heroes = await heroCount(workdir);
  const heroSprint = heroes < HERO_ROSTER_TARGET ? { heroes, target: HERO_ROSTER_TARGET } : null;
  const kind =
    options.kind === "auto"
      ? patchKindFor(options.date, shipped, dayWork.headlines.length > 0, heroSprint !== null)
      : options.kind;
  const pkg = await readJson<{ version: string }>(join(workdir, "package.json"));
  const current = shipped.at(-1)?.version ?? pkg.version;
  const version = nextVersion(current, kind);
  const runDir = join(options.runsDir, `${options.date}-${version}-${options.mode}`);
  const files = runFiles(runDir);
  // a fresh run of a night that ran before keeps the earlier attempt beside it, never mixed in
  const earlier = await access(runDir).then(
    () => true,
    () => false,
  );
  if (earlier) await rename(runDir, `${runDir}-attempt-${Date.now()}`);
  await mkdir(join(runDir, "logs"), { recursive: true });
  await mkdir(files.baseline, { recursive: true });
  await mkdir(files.scratch, { recursive: true });
  await mkdir(files.releaseAssets, { recursive: true });
  const baseSha = await headSha(workdir);
  const branch = `${BRANCH_PREFIX}${version}`;
  await git(workdir, "checkout", "-B", branch);
  await writeText(
    files.commits,
    `${await git(workdir, "log", "--no-merges", "--format=%h %ad %s", "--date=short", range)}\n`,
  );
  const ctx = {
    mode: options.mode,
    kind,
    version,
    date: options.date,
    workdir,
    runDir,
    branch,
    baseSha,
    lastTag: tag,
    previousVersions: shipped.map((p) => p.version),
    dayWork,
    heroSprint: kind === "big" ? heroSprint : null,
  };
  await writeJson(files.context, ctx);
  console.log(`[studio] ${options.mode} run: ${kind} patch ${version} for ${options.date} on ${branch}`);
  if (heroSprint && kind === "big")
    console.log(`[studio] hero sprint: ${heroSprint.heroes} of ${heroSprint.target} heroes, tonight adds one`);
  if (dayWork.headlines.length || dayWork.feedback.length)
    console.log(
      `[studio] day work on main: ${dayWork.headlines.length} headline commit(s), feedback ${dayWork.feedback.map((id) => `#${id}`).join(", ") || "none"}`,
    );
  return { ctx, files, costs: {}, sessionTotals: {} };
}
