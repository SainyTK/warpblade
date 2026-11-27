import { ARMORY_ITEMS } from "../../src/constants/armory";
import { COIN_BONUS, COIN_DROP } from "../../src/constants/coins";
import { MAX_LEVEL } from "../../src/constants/growth";
import { FUSIONS } from "../../src/constants/resonance";
import { STAGE_ORDER, STAGE_TIER } from "../../src/constants/stageGraph";
import { fusionRecipeId, UNLOCKS } from "../../src/constants/unlocks";
import { ELITE } from "../../src/constants/waves";
import { buildRoute } from "../../src/game/adventure/route";
import { CHARACTERS } from "../../src/heroes/roster";
import { STAGES } from "../../src/stages";
import type { Feat, GoalSource, TrackedStats } from "../../src/types/achievement";
import type { StageId } from "../../src/types/campaign";
import type { EnemyRank, EnemyType } from "../../src/types/enemy";
import type { UnlockDef } from "../../src/types/unlock";
import { isMet } from "../../src/utils/achievements";
import { armoryRates, levelsBought, nextPrice } from "../../src/utils/armory";
import { coinShare } from "../../src/utils/coins";
import { goalText } from "../../src/utils/goalText";
import { bandWave, stageMods } from "../../src/utils/stageArc";
import { applyFeat, emptyTracked } from "../../src/utils/trackedStats";
import { rewardKindLabel, rewardName } from "../../src/utils/unlocks";

const RUNS = 400;
const MENU_MINUTES = 1.5;
const STAGE_MINUTES = 25;
const FIRST_TRY_LEVEL = 14;
const LEVELS_PER_TRY = 16;

interface Foe {
  type: EnemyType;
  rank: EnemyRank;
  level: number;
  gold: number;
}

function stageFoes(stage: StageId, hyper: boolean): Foe[] {
  const mods = stageMods(STAGES[stage], hyper);
  const route = buildRoute(STAGES[stage], mods);
  const wave = (level: number): number => Math.min(30, Math.max(1, Math.round(bandWave(level))));
  const gold = (type: EnemyType, rank: EnemyRank, elite: boolean, level: number): number => {
    const base = COIN_DROP[type] ?? 2;
    const share = elite ? ELITE.coins : rank === "minion" ? coinShare(wave(level)) : 1;
    return base * share * mods.coins * (1 + COIN_BONUS);
  };
  const out: Foe[] = [];
  for (const area of route.areas) {
    for (const f of area.foes) out.push({ type: f.type, rank: "minion", level: f.level, gold: gold(f.type, "minion", !!f.elite, f.level) });
    for (const beat of area.beats) {
      if (beat.kind === "surge") {
        for (let i = 0; i < beat.count; i++) {
          const level = beat.from + ((beat.to - beat.from) * i) / beat.count;
          const type = beat.foes[i % beat.foes.length];
          out.push({ type, rank: "minion", level, gold: gold(type, "minion", (i + 1) % mods.eliteEvery === 0, level) });
        }
      } else {
        const rank: EnemyRank = beat.kind === "boss" ? "boss" : beat.kind === "mini" ? "mini" : "minion";
        out.push({ type: beat.foe, rank, level: beat.level + 0.5, gold: gold(beat.foe, rank, beat.kind === "elite", beat.level) });
      }
    }
  }
  return out;
}

const FOES = new Map<string, Foe[]>();
const foesOf = (stage: StageId, hyper: boolean): Foe[] => {
  const key = `${stage}${hyper ? ".hyper" : ""}`;
  if (!FOES.has(key)) FOES.set(key, stageFoes(stage, hyper));
  return FOES.get(key) as Foe[];
};

interface Player {
  stats: TrackedStats;
  coins: number;
  owned: Record<string, number>;
  spent: number;
  found: Set<string>;
  recipes: Set<string>;
  attempts: Record<string, number>;
  heroRuns: Record<string, number>;
  minutes: number;
}

function source(p: Player): GoalSource {
  const count = (kind: UnlockDef["reward"]["kind"]): number =>
    UNLOCKS.filter((u) => u.reward.kind === kind && p.found.has(u.id)).length;
  const unlockSpend = UNLOCKS.reduce((s, u) => s + (u.price !== undefined && p.found.has(u.id) ? u.price : 0), 0);
  return {
    stats: p.stats,
    armoryLevels: levelsBought(p.owned),
    heroesBought: count("hero"),
    skillsFound: count("skill"),
    fusionsFound: FUSIONS.filter((f) => p.recipes.has(fusionRecipeId(f.id))).length,
    goldSpent: p.spent + unlockSpend,
  };
}

const heroOpen = (p: Player, hero: string): boolean => !UNLOCKS.some((u) => u.id === `hero:${hero}`) || p.found.has(`hero:${hero}`);
const waits = (p: Player, u: UnlockDef): boolean => u.reward.kind === "skill" && !heroOpen(p, u.reward.hero);

function settle(p: Player): UnlockDef[] {
  const got: UnlockDef[] = [];
  for (;;) {
    const src = source(p);
    const free = UNLOCKS.filter((u) => u.price === undefined && !p.found.has(u.id) && !waits(p, u) && isMet(u, src));
    if (!free.length) return got;
    for (const u of free) p.found.add(u.id);
    got.push(...free);
  }
}

function shop(p: Player): UnlockDef[] {
  const bought: UnlockDef[] = [];
  const forSale = (kind: string) =>
    UNLOCKS.filter((u) => u.reward.kind === kind && u.price !== undefined && !p.found.has(u.id) && !waits(p, u) && isMet(u, source(p)));
  for (const kind of ["hero", "skill", "hyper"]) {
    for (const u of forSale(kind).sort((a, b) => (a.price ?? 0) - (b.price ?? 0))) {
      if ((u.price ?? 0) > p.coins) continue;
      p.coins -= u.price ?? 0;
      p.found.add(u.id);
      bought.push(u);
    }
  }
  for (;;) {
    const offers = ARMORY_ITEMS.filter((i) => p.found.has(`item:${i.id}`))
      .map((item) => ({ item, price: nextPrice(item, p.owned[item.id] ?? 0, levelsBought(p.owned)) }))
      .filter((o): o is { item: (typeof ARMORY_ITEMS)[number]; price: number } => o.price !== null && o.price <= p.coins)
      .sort((a, b) => a.price - b.price);
    if (!offers.length) break;
    p.coins -= offers[0].price;
    p.spent += offers[0].price;
    p.owned[offers[0].item.id] = (p.owned[offers[0].item.id] ?? 0) + 1;
  }
  return bought;
}

const armoryPower = (p: Player): number => {
  const share = (id: string): number => (p.owned[id] ?? 0) / (ARMORY_ITEMS.find((i) => i.id === id)?.levels ?? 1);
  return 0.3 * (share("edge") + share("arcana") + share("vitality") + share("precision")) / 4;
};

function chooseStage(p: Player): { stage: StageId; hyper: boolean } {
  const open = STAGE_ORDER.filter((s) => !UNLOCKS.some((u) => u.id === `stage:${s}`) || p.found.has(`stage:${s}`));
  const uncleared = open.filter((s) => !(p.stats.stages[s] ?? 0));
  if (uncleared.length) return { stage: uncleared[0], hyper: false };
  const hyper = open.filter((s) => p.found.has(`hyper:${s}`) && !(p.stats.stages[`${s}.hyper`] ?? 0));
  if (hyper.length) return { stage: hyper[0], hyper: true };
  return { stage: open[open.length - 1], hyper: open.some((s) => p.found.has(`hyper:${s}`)) };
}

function chooseHero(p: Player, run: number): string {
  const open = CHARACTERS.filter((c) => heroOpen(p, c.id));
  const left = (id: string) => UNLOCKS.filter((u) => u.reward.kind === "skill" && u.reward.hero === id && !p.found.has(u.id)).length;
  const wanting = open.filter((c) => left(c.id) > 0);
  const pool = wanting.length ? wanting : open;
  return pool[run % pool.length].id;
}

function reachLevel(p: Player, stage: StageId, hyper: boolean, hero: string): number {
  const key = `${stage}${hyper ? ".hyper" : ""}`;
  const tries = p.attempts[key] ?? 0;
  const tier = STAGE_TIER[stage] + (hyper ? 1 : 0);
  const fresh = (p.heroRuns[hero] ?? 0) < 2 ? 8 : 0;
  const level = FIRST_TRY_LEVEL + LEVELS_PER_TRY * tries + 100 * armoryPower(p) - 12 * (tier - 1) - fresh;
  return Math.max(9, Math.min(MAX_LEVEL, Math.round(level)));
}

function play(p: Player, run: number): { line: string; found: UnlockDef[] } {
  const hero = chooseHero(p, run);
  const { stage, hyper } = chooseStage(p);
  const reached = reachLevel(p, stage, hyper, hero);
  const cleared = reached >= MAX_LEVEL;
  const rates = armoryRates(ARMORY_ITEMS, p.owned);
  const feat = (f: Feat) => {
    p.stats = applyFeat(p.stats, f);
  };
  let gold = 0;
  let kills = 0;
  for (const foe of foesOf(stage, hyper)) {
    if (foe.level > reached) break;
    kills++;
    gold += foe.gold * rates.gold;
    feat({ kind: "kill", rank: foe.rank, foe: foe.type, hero });
  }
  for (let level = 2; level <= reached; level++) feat({ kind: "levelReached", level, hero });
  if (reached >= 85) feat({ kind: "evolved", skill: "sim", hero });
  if (reached >= 60) p.recipes.add(fusionRecipeId(FUSIONS[run % FUSIONS.length].id));
  const banked = Math.round(gold);
  p.coins += banked;
  feat({ kind: "banked", coins: banked });
  feat({ kind: "runEnd", outcome: cleared ? "clear" : "fallen", wave: 0, hero });
  if (cleared) feat({ kind: "stageCleared", stage, hyper, hero });
  const key = `${stage}${hyper ? ".hyper" : ""}`;
  p.attempts[key] = (p.attempts[key] ?? 0) + 1;
  p.heroRuns[hero] = (p.heroRuns[hero] ?? 0) + 1;
  p.minutes += STAGE_MINUTES * (reached / MAX_LEVEL) + MENU_MINUTES;
  const found = [...settle(p), ...shop(p)];
  found.push(...settle(p));
  const where = `${STAGES[stage].name}${hyper ? " Hyper" : ""}`;
  return { line: `${hero} ${where} L${reached} ${kills} kills ${banked} gold`, found };
}

const label = (u: UnlockDef): string => `${rewardName(u.reward)} (${rewardKindLabel(u.reward)})`;

function simulate(): string {
  const p: Player = {
    stats: emptyTracked(),
    coins: 0,
    owned: {},
    spent: 0,
    found: new Set(),
    recipes: new Set(),
    attempts: {},
    heroRuns: {},
    minutes: 0,
  };
  settle(p);
  const lines: string[] = [];
  const milestones: Record<string, string> = {};
  const mark = (name: string, done: boolean, run: number) => {
    if (done && !milestones[name]) milestones[name] = `run ${run}, ${(p.minutes / 60).toFixed(1)} h`;
  };
  let quiet = 0;
  for (let run = 1; run <= RUNS; run++) {
    const { line, found } = play(p, run);
    if (!found.length && run <= 30) quiet++;
    if (run <= 30) lines.push(`${String(run).padStart(2)} ${line}: ${found.map(label).join(", ") || "-"}`);
    const left = (hero?: string) =>
      UNLOCKS.filter((u) => u.reward.kind === "skill" && (!hero || u.reward.hero === hero) && !p.found.has(u.id)).length;
    mark("Kael and Cerise, all skills", !left("kael") && !left("cerise"), run);
    mark("Every hero", CHARACTERS.every((c) => heroOpen(p, c.id)), run);
    mark("Every stage cleared", STAGE_ORDER.every((s) => p.stats.stages[s]), run);
    mark("Every Armory item found", ARMORY_ITEMS.every((i) => p.found.has(`item:${i.id}`)), run);
    mark("Full Armory bought", ARMORY_ITEMS.every((i) => (p.owned[i.id] ?? 0) >= i.levels), run);
    mark("Every skill", !left(), run);
    mark("Every unlock", UNLOCKS.every((u) => p.found.has(u.id)), run);
  }
  const fullArmory = ARMORY_ITEMS.reduce(
    (acc, item) => {
      for (let level = 0; level < item.levels; level++) acc.total += nextPrice(item, level, acc.bought++) ?? 0;
      return acc;
    },
    { total: 0, bought: 0 },
  ).total;
  const stageGold = STAGE_ORDER.map((s) => `${STAGES[s].name} ${Math.round(foesOf(s, false).reduce((g, f) => g + f.gold, 0))}`);
  return [
    "First 30 runs (run, hero, stage, level reached, kills, gold banked: what unlocked)",
    ...lines,
    `Runs among the first 30 with nothing unlocked: ${quiet}`,
    "",
    "Milestones",
    ...Object.entries(milestones).map(([k, v]) => `${k}: ${v}`),
    "",
    `Full Armory in the cheapest order: ${fullArmory} gold`,
    `Gold for a full clear: ${stageGold.join(", ")}`,
    `Never met in ${RUNS} runs: ${UNLOCKS.filter((u) => !p.found.has(u.id)).map((u) => `${label(u)} [${goalText(u.goal)}]`).join("; ") || "none"}`,
  ].join("\n");
}

export const UNLOCK_PACING = simulate();
console.log(UNLOCK_PACING);
