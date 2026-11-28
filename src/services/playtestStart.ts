export interface PlaytestStart {
  stage: string | null;
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
  const stage = params.get("stage");
  if (!wave && !section && !stage) return null;
  return {
    stage,
    section,
    wave,
    level: positiveInt(params.get("level")) ?? 1,
    build: params.get("build"),
  };
}

/** the job a dev build starts the run in with `?job=`, beside `?wave=` and `?level=`; null in production builds */
export function readPlaytestJob(): string | null {
  if (!import.meta.env.DEV) return null;
  return new URLSearchParams(location.search).get("job");
}

/** a dev build started with `?paint=off` steps the game and keeps the HUD and dialogs, but draws no stage */
export function paintsStage(): boolean {
  if (!import.meta.env.DEV) return true;
  return new URLSearchParams(location.search).get("paint") !== "off";
}

export function readTrainingHero(): string | null {
  if (!import.meta.env.DEV) return null;
  return new URLSearchParams(location.search).get("training");
}

/** set by the studio's playtest harness before the page loads */
const PLAYTEST_KEY = "warpblade-playtest";

/**
 * A playtest bot session (dev builds only): every hero is unlocked and achievements are not tracked, so bots can play
 * each hero and leave no stats behind. Production builds never read it.
 */
export function isPlaytestSession(): boolean {
  if (!import.meta.env.DEV) return false;
  if (readTrainingHero() !== null) return true;
  try {
    return localStorage.getItem(PLAYTEST_KEY) === "1";
  } catch {
    return false;
  }
}
