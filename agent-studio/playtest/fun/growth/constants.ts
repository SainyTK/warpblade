export const FIRST_RUN_SEED = 10_000;

export const STAGE_CHOICES_PER_RUN = 1;

export const LUCK = 1;

export const BOSS_CHEST_LEAST = 3;

export const ELITE_CHEST_LEAST = 1;

export const FOES_IN_REACH = 4;

export const FOES_IN_REACH_LOW = 3;

export const FOES_IN_REACH_HIGH = 5;

export const HITS_PER_FOE = 2;

export const MINION_SHARE = 0.8;

export const CORE_SIZE = 4;

export const SECONDS_PER_MINUTE = 60;

export const NOVELTY_WINDOW_MINUTES = 10;

export const PERCENT = 100;

export const HIGHEST_WAVE = 30;

export const FIELD_STEP_SECONDS = 15;

export const EVOLVED_INVESTMENT = 3;

export const DPS_MODEL = {
  baseKit: 85,
  baseAttackShare: 0.65,
  chargedShareOfAttacks: 0.3,
  crit: 1.75,
  mostFrozenShare: 0.6,
  riskValue: { easy: 70, timed: 112, precise: 190 },
  kindScale: { attack: 1, spell: 1, summon: 1, movement: 0.8, dot: 1.25, passive: 0, ultimate: 0.25 },
  firstLevelShare: {
    attack: 1 / 8,
    spell: 1 / 8,
    movement: 1 / 8,
    passive: 1 / 8,
    ultimate: 1 / 6,
    dot: 1 / 12,
    summon: 1 / 10,
  },
  evolvedTimes: { easy: 2, timed: 2.2, precise: 3 },
  abilityPowerKinds: ["spell"],
  cooldownKinds: ["spell", "summon", "ultimate"],
} as const;

export const FUSION_EFFECTS = {
  causticFirePerVenomStack: 0.08,
  entropyChancePerVenomStack: 0.01,
  stasisShare: 1.2,
  doubledBy: 2,
  voidRiftEchoes: 2,
  plasmaExtraTargets: 1,
} as const;

export const BOSS_ATTACKS: Readonly<Record<string, readonly string[]>> = {
  oakheart: ["sweep", "root", "acorn"],
  boghulk: ["slam", "wave", "glob", "rush"],
  shepherd: ["reap", "toll", "shard"],
  warden: ["orb", "dive"],
  cindersmith: ["slam", "shock", "ingot", "breath", "rain"],
  rimeclaw: ["pounce", "landing", "tail", "icicle", "breath", "shard"],
  tempestroc: ["swoop", "bolt", "feather", "breath"],
  sporeheart: ["lash", "bomb", "puddle", "root", "sweep", "pulse"],
  pagewyrm: ["erupt", "page", "wave", "bite"],
  sovereign: ["cleave", "pillar", "spikes"],
};

export const MEASURE_IDS = {
  powerAgainstWorld: "M3.1",
  growthRunway: "M3.3",
  runLength: "M3.4",
  decisionsPerRun: "M7.1",
  buildSpread: "M7.2",
  chosenGrowth: "M7.3",
  noveltyRate: "M8.1",
} as const;

export const BUNDLE = {
  cacheFolder: "warpblade-growth-bundles",
  entryFile: "entry.ts",
  bundleFile: "game.mjs",
  gamePaths: ["src", "package.json", "package-lock.json"],
} as const;

export const OUTPUT_FILES = {
  runs: "runs.json",
  stages: "stages.json",
  novelty: "novelty.json",
  summary: "summary.json",
} as const;

export const GAME_MODULES = {
  roster: { path: "/src/heroes/roster.ts", names: ["CHARACTERS"] },
  stages: { path: "/src/stages/index.ts", names: ["STAGES"] },
  arts: { path: "/src/stages/arts.ts", names: ["ARTS"] },
  graph: { path: "/src/constants/stageGraph.ts", names: ["STAGE_ORDER"] },
  arc: { path: "/src/constants/stageArc.ts", names: ["FLYER_TOUGHNESS"] },
  defense: {
    path: "/src/constants/defense.ts",
    names: ["DEFENSE_SECONDS", "BIG_FOE_CALLS", "BIG_FOE_XP_SECONDS", "SIDE_STYLE"],
  },
  clock: { path: "/src/utils/defenseClock.ts", names: ["levelAtSecond", "foesPerSecond", "frontAt"] },
  progression: { path: "/src/utils/progression.ts", names: ["xpToReach"] },
  growth: {
    path: "/src/constants/growth.ts",
    names: ["MAX_LEVEL", "SKILL_MAX_LEVEL", "SKILL_SLOTS", "MASTERY", "CHARGE_RANK", "ATTUNEMENT"],
  },
  resonance: { path: "/src/constants/resonance.ts", names: ["BLAZE", "FROST", "STORM", "VENOM", "VOID"] },
  boons: { path: "/src/constants/boons.ts", names: ["BOONS"] },
  ladder: { path: "/src/utils/ladder.ts", names: ["ladderChoices"] },
  stageArc: { path: "/src/utils/stageArc.ts", names: ["stageMods", "ladderHp", "bandWave"] },
  kinds: { path: "/src/game/enemies/kinds/index.ts", names: ["kindOf"] },
  bossFight: { path: "/src/game/bossFight/profiles.ts", names: ["bossProfile"] },
  rng: { path: "/src/utils/rng.ts", names: ["Rng"] },
  build: { path: "/src/utils/build.ts", names: ["freshBuild"] },
  cards: { path: "/src/utils/cards.ts", names: ["dealCards", "cardCount"] },
  supply: { path: "/src/utils/cardSupply.ts", names: ["picksBetween"] },
  chests: { path: "/src/utils/chests.ts", names: ["rollChest"] },
  stats: { path: "/src/utils/stats.ts", names: ["computeStats"] },
  skills: { path: "/src/utils/skills.ts", names: ["heldRows", "growthRows"] },
  pacts: { path: "/src/utils/pacts.ts", names: ["pactTotals"] },
  ranks: { path: "/src/utils/resonance.ts", names: ["resonanceRanks", "resonanceStats", "activeFusions"] },
} as const;
