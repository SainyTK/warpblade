import type { BestStat, CountStat, Feat, TrackedStats } from "../types/achievement";

const COUNT_STATS: readonly CountStat[] = [
  "kills",
  "clears",
  "miniKills",
  "bossKills",
  "perfects",
  "evolutions",
  "ultimates",
  "coinsBanked",
];
const BEST_STATS: readonly BestStat[] = ["wave", "combo"];

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

function counts<K extends string>(keys: readonly K[], raw: unknown): Record<K, number> {
  const saved = isRecord(raw) ? raw : {};
  return Object.fromEntries(keys.map((k) => [k, count(saved[k])])) as Record<K, number>;
}

export const emptyTracked = (): TrackedStats => parseTracked(null);

/** read saved tracked stats, keeping known counters as whole, positive numbers; anything else starts at 0 */
export function parseTracked(raw: unknown): TrackedStats {
  const saved = isRecord(raw) ? raw : {};
  const heroWave: Record<string, number> = {};
  if (isRecord(saved.heroWave))
    for (const [hero, wave] of Object.entries(saved.heroWave)) if (count(wave)) heroWave[hero] = count(wave);
  return { counts: counts(COUNT_STATS, saved.counts), best: counts(BEST_STATS, saved.best), heroWave };
}

const raise = (now: number, to: number): number => Math.max(now, to);

/** the stats after something happened in play */
export function applyFeat(s: TrackedStats, feat: Feat): TrackedStats {
  const c = { ...s.counts };
  const best = { ...s.best };
  const heroWave = { ...s.heroWave };
  switch (feat.kind) {
    case "kill":
      c.kills++;
      if (feat.rank === "mini") c.miniKills++;
      if (feat.rank === "boss") c.bossKills++;
      break;
    case "waveReached":
      best.wave = raise(best.wave, feat.wave);
      break;
    case "waveCleared":
      heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
      break;
    case "runEnd":
      if (feat.outcome === "clear") {
        c.clears++;
        heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
      }
      break;
    case "comboHit":
      best.combo = raise(best.combo, feat.moves);
      break;
    case "perfect":
      c.perfects++;
      break;
    case "learned":
      if (feat.skill === "ultimate") c.ultimates++;
      if (feat.skill === "evolution") c.evolutions++;
      break;
    case "banked":
      c.coinsBanked += Math.max(0, feat.coins);
      break;
  }
  return { counts: c, best, heroWave };
}
