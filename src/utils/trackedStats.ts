import { LIGHT_RELICS } from "../constants/unlocks";
import type { BestStat, CountStat, Feat, RunTally, TrackedStats } from "../types/achievement";
import type { SourceId } from "../types/build";

const COUNT_STATS: readonly CountStat[] = [
  "kills",
  "clears",
  "miniKills",
  "bossKills",
  "perfects",
  "evolutions",
  "ultimates",
  "coinsBanked",
  "relicKills",
  "relicEvolutions",
  "chests",
  "flowFulls",
];
const BEST_STATS: readonly BestStat[] = [
  "wave",
  "combo",
  "cleared",
  "relicLevel",
  "chestUpgrades",
  "lightWave",
  "runBackAttacks",
  "runPerfects",
  "runBlows",
  "runRelicKills",
];
/** the hero's own sources; every other source is a relic */
const HERO_SOURCES: readonly SourceId[] = ["attacks", "abilities", "ultimate"];

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

function counts<K extends string>(keys: readonly K[], raw: unknown): Record<K, number> {
  const saved = isRecord(raw) ? raw : {};
  return Object.fromEntries(keys.map((k) => [k, count(saved[k])])) as Record<K, number>;
}

export const emptyTracked = (): TrackedStats => parseTracked(null);
export const emptyRun = (): RunTally => ({ backAttacks: 0, perfects: 0, blows: 0, relicKills: 0, relics: [] });

/** read saved tracked stats, keeping known counters as whole, positive numbers; anything else starts at 0 */
export function parseTracked(raw: unknown): TrackedStats {
  const saved = isRecord(raw) ? raw : {};
  const heroWave: Record<string, number> = {};
  if (isRecord(saved.heroWave))
    for (const [hero, wave] of Object.entries(saved.heroWave)) if (count(wave)) heroWave[hero] = count(wave);
  const best = counts(BEST_STATS, saved.best);
  // a save from before the highest wave cleared was kept has it in the waves cleared with each hero
  best.cleared = Math.max(best.cleared, ...Object.values(heroWave));
  return { counts: counts(COUNT_STATS, saved.counts), best, heroWave, run: emptyRun() };
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
      if (feat.source && !HERO_SOURCES.includes(feat.source)) {
        c.relicKills++;
        run.relicKills++;
        best.runRelicKills = raise(best.runRelicKills, run.relicKills);
      }
      break;
    case "waveReached":
      best.wave = raise(best.wave, feat.wave);
      if (run.relics.length <= LIGHT_RELICS) best.lightWave = raise(best.lightWave, feat.wave);
      break;
    case "waveCleared":
      heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
      best.cleared = raise(best.cleared, feat.wave);
      break;
    case "runEnd":
      if (feat.outcome === "clear") {
        c.clears++;
        heroWave[feat.hero] = raise(heroWave[feat.hero] ?? 0, feat.wave);
        best.cleared = raise(best.cleared, feat.wave);
      }
      break;
    case "comboHit":
      best.combo = raise(best.combo, feat.moves);
      run.blows++;
      best.runBlows = raise(best.runBlows, run.blows);
      break;
    case "perfect":
      c.perfects++;
      run.perfects++;
      best.runPerfects = raise(best.runPerfects, run.perfects);
      break;
    case "learned":
      if (feat.skill === "ultimate") c.ultimates++;
      if (feat.skill === "evolution") c.evolutions++;
      break;
    case "banked":
      c.coinsBanked += Math.max(0, feat.coins);
      break;
    case "backAttack":
      run.backAttacks++;
      best.runBackAttacks = raise(best.runBackAttacks, run.backAttacks);
      break;
    case "relicLevel":
      best.relicLevel = raise(best.relicLevel, feat.level);
      if (!run.relics.includes(feat.relic)) run.relics = [...run.relics, feat.relic];
      break;
    case "evolved":
      c.relicEvolutions++;
      break;
    case "chestOpened":
      c.chests++;
      best.chestUpgrades = raise(best.chestUpgrades, feat.upgrades);
      break;
    case "flowFull":
      c.flowFulls++;
      break;
  }
  return { counts: c, best, heroWave, run };
}
