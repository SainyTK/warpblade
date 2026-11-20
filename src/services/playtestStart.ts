export interface PlaytestStart {
  section: number | null;
  wave: number | null;
  level: number;
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
  const section = positiveInt(params.get("section"));
  if (!wave && !section) return null;
  return { section, wave, level: positiveInt(params.get("level")) ?? 1, build: params.get("build") };
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
