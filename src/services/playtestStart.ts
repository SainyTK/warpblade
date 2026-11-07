/** A development-only way for the playtest bots to begin a run later in the stage: `?wave=20&level=14`, with skills,
    charms and evolutions held from the start: `&build=<skill id>:8,evolve:<skill id>,might:5`.
    Production builds never read it, so players always start at wave 1. */
export interface PlaytestStart {
  /** the first wave the run fights */
  wave: number;
  /** the hero level the run starts at; its skill points are picked before the first fight */
  level: number;
  /** skills, charms and evolutions held from the start, as written (`parseStartBuild`); null when none was asked for */
  build: string | null;
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
  return { wave, level: positiveInt(params.get("level")) ?? 1, build: params.get("build") };
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
