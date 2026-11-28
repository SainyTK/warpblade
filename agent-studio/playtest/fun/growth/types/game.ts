export type SkillKind = "attack" | "spell" | "summon" | "movement" | "dot" | "passive" | "ultimate";

export type SkillRisk = "easy" | "timed" | "precise";

export type ElementId = "blaze" | "frost" | "storm" | "venom" | "void";

export type Ranks = Record<ElementId, number>;

export interface SkillDef {
  id: string;
  kind: SkillKind;
  risk: SkillRisk;
}

export interface HeroDef {
  id: string;
  base: { ad: number; ap: number; crit: number };
  skills: readonly SkillDef[];
}

export interface Build {
  skills: Record<string, number>;
  arts: Record<string, number>;
  evolved: string[];
  mastery: Record<string, number>;
  chargeRank: number;
  attunement: Record<string, number>;
  honing: Record<string, number>;
  banished: string[];
}

export interface Card {
  type: string;
  id: string;
  level?: number;
}

export interface ChestReward {
  type: string;
  id?: string;
}

export interface Random {
  next(): number;
  pick<T>(items: readonly T[]): T;
}

export interface HeroStats {
  ad: number;
  ap: number;
  aspd: number;
  haste: number;
  crit: number;
}

export interface StatRow {
  scale?: { ad?: number; ap?: number };
}

export interface LadderFoe {
  foe: string;
  level: number;
  hits: number;
}

export interface StageMods {
  hp: number;
  crowd: number;
  eliteEvery: number;
}

export interface MiniBoss {
  name: string;
  base: string;
  moves: readonly string[];
  adds: readonly string[];
}

export interface StageDef {
  id: string;
  boss: string;
  hazard?: unknown;
  mini: MiniBoss;
  ladder: readonly LadderFoe[];
}

export type BigFoeKind = "elite" | "mini" | "boss";

export interface BigFoeCall {
  at: number;
  kind: BigFoeKind;
}

export interface Front {
  from: number;
  sides: readonly string[];
}

export interface DefenseRules {
  seconds: number;
  calls: readonly BigFoeCall[];
  xpSeconds: Readonly<Record<BigFoeKind, number>>;
  eliteEveryBySide: Readonly<Record<string, number>>;
}

export interface ResonanceRules {
  blaze: {
    tickShare: number;
    tickSharePerRank: number;
    baseStacks: number;
    stacksPerRank: number;
    every: number;
    duration: number;
  };
  frost: {
    baseHitsToFreeze: number;
    hitsPerRank: number;
    fewestHitsToFreeze: number;
    freeze: number;
    frozenTaken: number;
    frozenTakenPerRank: number;
  };
  storm: {
    chance: number;
    chancePerRank: number;
    share: number;
    sharePerRank: number;
    ranksPerTarget: number;
    overchargeRank: number;
  };
  venom: {
    takenPerStack: number;
    baseStacks: number;
    stacksPerRank: number;
    tickShare: number;
    every: number;
    duration: number;
  };
  void: {
    chance: number;
    chancePerRank: number;
    mostChance: number;
    share: number;
    sharePerRank: number;
    riftRank: number;
  };
}

export interface GrowthRules {
  skillMaxLevel: number;
  skillSlots: number;
  masteryLevels: number;
  chargeRanks: number;
  chargeDamage: number;
  attunementLevels: number;
}

export interface Game {
  heroes: readonly HeroDef[];
  stageOrder: readonly string[];
  stages: Readonly<Record<string, StageDef>>;
  defense: DefenseRules;
  flyerToughness: number;
  maxLevel: number;
  growth: GrowthRules;
  resonance: ResonanceRules;
  boons: readonly unknown[];
  random(seed: number): Random;
  stageMods(stage: StageDef): StageMods;
  levelAtSecond(seconds: number): number;
  foesPerSecond(seconds: number): number;
  frontAt(seconds: number): Front;
  xpToReach(level: number): number;
  ladderChoices(
    ladder: readonly LadderFoe[],
    level: number,
    fits?: (foe: string) => boolean,
  ): readonly { foe: string; weight: number }[];
  ladderHp(entry: LadderFoe, mods: StageMods): number;
  flies(foe: string): boolean;
  bossAdds(foe: string): readonly string[];
  bandWave(level: number): number;
  freshBuild(): Build;
  cardCount(luck: number, random: Random): number;
  dealCards(
    hero: HeroDef,
    view: { build: Build; level: number; charged: boolean },
    random: Random,
    count: number,
    boons: readonly unknown[],
  ): Card[];
  picksBetween(from: number, to: number): number;
  rollChest(hero: HeroDef, build: Build, wave: number, luck: number, random: Random, least: number): ChestReward[];
  computeStats(
    hero: HeroDef,
    level: number,
    rows: readonly StatRow[],
    bonus: object,
    stats: { cooldown: number },
  ): HeroStats;
  heldRows(hero: HeroDef, build: Build): readonly StatRow[];
  growthRows(build: Build): readonly StatRow[];
  pactPower(hero: HeroDef, build: Build): number;
  resonanceRanks(build: Build, hero: HeroDef): Ranks;
  resonanceStats(ranks: Ranks): { cooldown: number };
  activeFusions(ranks: Ranks): readonly string[];
}
