/** A development-only way for the playtest bots to begin a run later in the stage: `?wave=20&level=14`.
    Production builds never read it, so players always start at wave 1. */
export interface PlaytestStart {
  /** the first wave the run fights */
  wave: number;
  /** the hero level the run starts at; its skill points are picked before the first fight */
  level: number;
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
  return { wave, level: positiveInt(params.get("level")) ?? 1 };
}
