import { HERO_SOURCES } from "../constants/damageSources";
import type { BestStat, CountStat, Feat, RunTally, TrackedStats } from "../types/achievement";

const COUNT_STATS: readonly CountStat[] = [
  "kills",
  "clears",
  "beyonds",
  "miniKills",
  "bossKills",
  "perfects",
  "evolutions",
  "ultimates",
  "coinsBanked",
  "chests",
  "flowFulls",
];
const BEST_STATS: readonly BestStat[] = [
  "wave",
  "combo",
  "skillLevel",
  "chestUpgrades",
  "runPerfects",
  "runSkillKills",
  "swingKills",
  "fieldKills",
  "wickKills",
  "backKills",
];

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

function counts<K extends string>(keys: readonly K[], raw: unknown): Record<K, number> {
  const saved = isRecord(raw) ? raw : {};
  return Object.fromEntries(keys.map((k) => [k, count(saved[k])])) as Record<K, number>;
}

export const emptyTracked = (): TrackedStats => parseTracked(null);
export const emptyRun = (): RunTally => ({ perfects: 0, skillKills: 0 });

/** read saved tracked stats, keeping known counters as whole, positive numbers; anything else starts at 0 */
export function parseTracked(raw: unknown): TrackedStats {
  const saved = isRecord(raw) ? raw : {};
  const heroWave: Record<string, number> = {};
  if (isRecord(saved.heroWave))
    for (const [hero, wave] of Object.entries(saved.heroWave)) if (count(wave)) heroWave[hero] = count(wave);
  return { counts: counts(COUNT_STATS, saved.counts), best: counts(BEST_STATS, saved.best), heroWave, run: emptyRun() };
}

const raise = (now: number, to: number): number => Math.max(now, to);

/** the stats after something happened in play */
export function applyFeat(s: TrackedStats, feat: Feat): TrackedStats {
  const c = { ...s.counts };
  const best = { ...s.best };
  const heroWave = { ...s.heroWave };
  const run = { ...s.run };
  switch (feat.kind) {
    case "kill":
      c.kills++;
      if (feat.rank === "mini") c.miniKills++;
      if (feat.rank === "boss") c.bossKills++;
      if (feat.source && !HERO_SOURCES.has(feat.source)) {
        run.skillKills++;
        best.runSkillKills = raise(best.runSkillKills, run.skillKills);
      }
      break;
    case "waveReached":
      best.wave = raise(best.wave, feat.wave);
      break;
    case "waveCleared":
      heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
      break;
    case "runEnd":
      if (feat.outcome === "clear" || feat.outcome === "beyond") {
        c.clears++;
        if (feat.outcome === "beyond") c.beyonds++;
        heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
      }
      break;
    case "comboHit":
      best.combo = raise(best.combo, feat.moves);
      break;
    case "perfect":
      c.perfects++;
      run.perfects++;
      best.runPerfects = raise(best.runPerfects, run.perfects);
      break;
    case "ultimateLearned":
      c.ultimates++;
      break;
    case "banked":
      c.coinsBanked += Math.max(0, feat.coins);
      break;
    case "skillLevel":
      best.skillLevel = raise(best.skillLevel, feat.level);
      break;
    case "evolved":
      c.evolutions++;
      break;
    case "chestOpened":
      c.chests++;
      best.chestUpgrades = raise(best.chestUpgrades, feat.upgrades);
      break;
    case "flowFull":
      c.flowFulls++;
      break;
    case "swingKills":
      best.swingKills = raise(best.swingKills, feat.kills);
      break;
    case "fieldKills":
      best.fieldKills = raise(best.fieldKills, feat.kills);
      break;
    case "wickKills":
      best.wickKills = raise(best.wickKills, feat.kills);
      break;
    case "backKills":
      best.backKills = raise(best.backKills, feat.kills);
      break;
  }
  return { counts: c, best, heroWave, run };
}
