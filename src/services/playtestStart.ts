import { parseStartBuild, type StartBuild } from "../utils/build";

/** A development-only way for the playtest bots to begin a run later in the stage: `?wave=20&level=14`, with relics,
    charms and evolutions held from the start: `&build=wisp:8,might:5,evolve:wisp`.
    Production builds never read it, so players always start at wave 1. */
export interface PlaytestStart {
  /** the first wave the run fights */
  wave: number;
  /** the hero level the run starts at; its skill points are picked before the first fight */
  level: number;
  /** relics, charms and evolutions held from the start; null when none was asked for */
  build: StartBuild | null;
}

function positiveInt(value: string | null): number | null {
  const n = Number(value);
  return value !== null && Number.isInteger(n) && n > 0 ? n : null;
}

export function readPlaytestStart(): PlaytestStart | null {
  if (!import.meta.env.DEV) return null;
  const params = new URLSearchParams(location.search);
  const wave = positiveInt(params.get("wave"));
  if (!wave) return null;
  const build = params.get("build");
  return { wave, level: positiveInt(params.get("level")) ?? 1, build: build ? parseStartBuild(build) : null };
}

/** set by the studio's playtest harness before the page loads */
const PLAYTEST_KEY = "warpblade-playtest";

/**
 * A playtest bot session (dev builds only): every hero is unlocked and achievements are not tracked, so bots can play
 * each hero and leave no stats behind. Production builds never read it.
 */
export function isPlaytestSession(): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    return localStorage.getItem(PLAYTEST_KEY) === "1";
  } catch {
    return false;
  }
}
