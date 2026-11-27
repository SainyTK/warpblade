import { HERO_SOURCES } from "../constants/damageSources";
import { ENEMIES } from "../constants/enemies";
import type { BestStat, CountStat, Feat, RunTally, TrackedStats } from "../types/achievement";
import type { StageId } from "../types/campaign";
import type { EnemyType } from "../types/enemy";

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
];

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

function counts<K extends string>(keys: readonly K[], raw: unknown): Record<K, number> {
  const saved = isRecord(raw) ? raw : {};
  return Object.fromEntries(keys.map((k) => [k, count(saved[k])])) as Record<K, number>;
}

export const emptyTracked = (): TrackedStats => parseTracked(null);
export const emptyRun = (): RunTally => ({ perfects: 0, skillKills: 0 });

/** the whole, positive numbers of a saved record, by key */
function wholeNumbers(raw: unknown): Record<string, number> {
  const kept: Record<string, number> = {};
  if (isRecord(raw)) for (const [key, value] of Object.entries(raw)) if (count(value)) kept[key] = count(value);
  return kept;
}

const isFoe = (key: string): key is EnemyType => Object.hasOwn(ENEMIES, key);

/** the kills of each foe type the game still has; a save from before foes were counted reads as none */
function foeKills(raw: unknown): Partial<Record<EnemyType, number>> {
  const kept: Partial<Record<EnemyType, number>> = {};
  for (const [key, value] of Object.entries(wholeNumbers(raw))) if (isFoe(key)) kept[key] = value;
  return kept;
}

/** read saved tracked stats, keeping known counters as whole, positive numbers; anything else starts at 0 */
export function parseTracked(raw: unknown): TrackedStats {
  const saved = isRecord(raw) ? raw : {};
  return {
    counts: counts(COUNT_STATS, saved.counts),
    best: counts(BEST_STATS, saved.best),
    heroWave: wholeNumbers(saved.heroWave),
    hero: wholeNumbers(saved.hero),
    foes: foeKills(saved.foes),
    stages: wholeNumbers(saved.stages),
    run: emptyRun(),
  };
}

const raise = (now: number, to: number): number => Math.max(now, to);

export const stageKey = (stage: StageId, hyper = false): string => (hyper ? `${stage}.hyper` : stage);

/** the stats after something happened in play */
export function applyFeat(s: TrackedStats, feat: Feat): TrackedStats {
  const c = { ...s.counts };
  const best = { ...s.best };
  const heroWave = { ...s.heroWave };
  const hero = { ...s.hero };
  const foes = { ...s.foes };
  const stages = { ...s.stages };
  const run = { ...s.run };
  switch (feat.kind) {
    case "kill":
      c.kills++;
      foes[feat.foe] = (foes[feat.foe] ?? 0) + 1;
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
    case "stageCleared": {
      const key = stageKey(feat.stage, feat.hyper);
      stages[key] = (stages[key] ?? 0) + 1;
      hero[`${feat.hero}.stage.${key}`] = (hero[`${feat.hero}.stage.${key}`] ?? 0) + 1;
      break;
    }
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
    case "heroCount":
      hero[feat.stat] = (hero[feat.stat] ?? 0) + Math.max(0, feat.add);
      break;
    case "heroBest":
      hero[feat.stat] = raise(hero[feat.stat] ?? 0, feat.value);
      break;
  }
  return { counts: c, best, heroWave, hero, foes, stages, run };
}
