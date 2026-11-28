export const ROOM_MODULES = {
  state: "/src/game/state.ts",
  progress: "/src/game/progress.ts",
  trail: "/src/game/adventure/trail.ts",
  route: "/src/game/adventure/route.ts",
  stages: "/src/stages/index.ts",
  stageArc: "/src/constants/stageArc.ts",
  stageMods: "/src/utils/stageArc.ts",
  growth: "/src/constants/growth.ts",
  waves: "/src/constants/waves.ts",
  vitals: "/src/constants/vitals.ts",
  enemies: "/src/constants/enemies.ts",
  progression: "/src/utils/progression.ts",
  chests: "/src/utils/chests.ts",
  raise: "/src/game/build/raise.ts",
  buildStats: "/src/game/build/stats.ts",
  rng: "/src/utils/rng.ts",
  cards: "/src/utils/cards.ts",
  cardView: "/src/game/build/cardView.ts",
  boons: "/src/constants/boons.ts",
  cardFace: "/src/ui/skills/cardFace.ts",
  pickCard: "/src/ui/skills/pickCard.ts",
  stageTier: "/src/constants/stageGraph.ts",
} as const;

export const MEASURE_IDS = {
  clearRate: "M2.1",
  fairHits: "M2.2",
  escalation: "M2.3",
  fightLength: "M2.4",
  skillGap: "M6.1",
  rewardRhythm: "M3.2",
} as const;

export const SKILLED = "skilled";
export const MASH = "mash";
export const PLAN_SEED = 1;
export const ESCALATION_MIN_STAGES = 3;
export const BOSS_CHEST_LEAST = 3;

export const ROOM_LIMIT_MS = 300_000;
export const KEEP_ALIVE_SHARE = 0.5;
export const STAGE_DONE_MODE = "map";
export const ROOM_ENTRY_OFFSET = 22;
export const SETUP_PICK_LIMIT = 1000;

export const FAIR_WINDUP_MS = 250;
export const MIN_HIT_LOSS = 0.5;
export const REWARD_MERGE_MS = 1000;
export const SHORT_TELL_LIST = 8;

export const RECORDING_KEY = "__funRoomsRecording";
export const DEALT_KEY = "__funRoomsDealt";

export const RECORDER_TUNING = {
  neutralStates: ["drift", "walk", "recover", "hop"],
  nearReach: 80,
  chainMemoryMs: 1500,
  goneGraceMs: 300,
} as const;

export const ROAD_TUNING = {
  fightReach: { x: 90, y: 60 },
  fightPatienceMs: 15_000,
  ignoreFoesMs: 4_000,
  wallLook: { behind: -2, ahead: 30 },
  stuckMs: 500,
  progressStep: 4,
  jumpPlan: [true, true, true, true, false, false, true, true, true, true, false],
} as const;

export const RUN_ATTEMPTS = 2;
export const ROOM_WALL_MINUTES = 30;
export const STAGE_WALL_SHARE = 3;
export const PAINT = "off";

export const OUTPUT_FILES = { runs: "runs", summary: "summary.json" } as const;
