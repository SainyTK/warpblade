import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { openGame } from "../session/openGame";
import type { ScenarioFlags } from "../types/cli";
import type { ScenarioReport } from "../types/report";
import type { Session } from "../types/session";
import { secondsSince } from "../utils/elapsed";
import { parseViewport } from "../utils/viewport";
import { withWallLimit } from "../utils/wallLimit";

type Scenario = (session: Session) => Promise<unknown>;

/** a .ts file outside an ES module package loads as CommonJS, where the export sits one level deeper */
function defaultExport(module: { default?: unknown }): unknown {
  const inner = module.default as { default?: unknown } | undefined;
  return typeof inner === "object" && inner !== null ? inner.default : inner;
}

async function loadScenario(file: string): Promise<Scenario> {
  const play = defaultExport((await import(pathToFileURL(file).href)) as { default?: unknown });
  if (typeof play !== "function") {
    throw new Error(`${file} must export a default async function (session) => {...}.`);
  }
  return play as Scenario;
}

/** run a script's default export against a fresh game session */
export async function scenario(flags: ScenarioFlags): Promise<ScenarioReport> {
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const file = resolve(flags.file);
  const play = await loadScenario(file);
  const viewport = flags.viewport ? parseViewport(flags.viewport) : undefined;
  const session = await openGame({ root: flags.root, hero: flags.hero, viewport, start: flags.start });
  let result: unknown = null;
  let error: string | undefined;
  try {
    result = await withWallLimit(play(session), flags.maxMinutes, file);
  } catch (caught) {
    error = caught instanceof Error ? (caught.stack ?? caught.message) : String(caught);
  }
  const pageErrors = session.errors();
  await session.close();
  return {
    command: "scenario",
    ok: error === undefined && pageErrors.length === 0,
    root: flags.root,
    startedAt,
    wallSeconds: secondsSince(started),
    pageErrors,
    file,
    result: result ?? null,
    error,
  };
}
