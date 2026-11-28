import type { ShotKind } from "./types";

export const INDEX_FILE = "index.json";
export const STILLS_DIR = "stills";
export const CLIPS_DIR = "clips";

export const PAGE_MODULES = {
  state: "/src/game/state.ts",
  progress: "/src/game/progress.ts",
} as const;

export const BOSS_CALM_STATES: readonly string[] = ["walk", "drift", "recover"];
export const PICK_LEVEL = 10;

export const PHONE_VIEWPORTS = [
  { width: 844, height: 390 },
  { width: 390, height: 844 },
] as const;

export const BUILDS: Readonly<Record<string, string>> = {
  kael: "evolve:k_volt,evolve:k_familiar,k_flame:8,k_frost:8,k_echo:8,k_static:8",
  brynn: "evolve:br_splinter,evolve:br_echo,br_falling:8,br_arc:8,br_cinder:8,br_cleave:8",
  cerise: "evolve:ce_mirror,evolve:ce_petals,ce_sentinel:8,ce_needle:8,ce_thorns:8,ce_riposte:8",
};

export const BOSS_LEVEL = 80;
export const BOSS_SHARDS = { hearts: 12, manas: 6 } as const;
export const BOSS_SECTION = 8;
export const SIEGE_LEVEL = 60;
export const SIEGE_SHARDS = { hearts: 8, manas: 4 } as const;
export const SIEGE_SECTION = 7;
export const SIEGE_FOES = 6;

export const BOT_TICK_MS = 50;
export const CRYSTAL_REACH = 60;
export const ENGAGE_RANGE = 60;
export const CHEST_WAIT_MS = 600;
export const WALK_STEP_MS = 60;
export const WALK_STEPS = 80;
export const WALK_TOLERANCE = 10;
export const MENU_STEPS = 12;
export const PICK_LIMIT = 200;
export const FACE_RANGE = 40;
export const FACE_GAP = 30;

export const WAIT = {
  load: 1500,
  banner: 600,
  menu: 700,
  screen: 900,
  shortScreen: 400,
  pick: 700,
  bossArrive: 1500,
  windUp: 4000,
  result: 1500,
  resultPoll: 250,
} as const;

export const LIMITS = {
  firstFoe: 30_000,
  reachBoss: 120_000,
  holdCrystal: 240_000,
  siege: 60_000,
  resultPolls: 40,
} as const;

export const CLIPS = {
  combatMs: 5000,
  hitWidth: 1280,
  bossAttackMs: 4500,
  chargeHoldMs: 2400,
  chargeAfterMs: 1600,
  midFightMs: 2500,
  fightLeadMs: 1200,
  leadInMs: 34,
} as const;

export const HIT_STRIKES = { count: 8, pressMs: 120, gapMs: 80 } as const;

export const RUBRIC_SHOTS: Readonly<Record<string, readonly ShotKind[]>> = {
  R1: ["combatClip", "hitClip"],
  R2: ["siege", "bossAttackClip", "bossFight"],
  R3: ["fight", "bossFight", "pick"],
  R4: ["pick", "fight", "menuStage", "result"],
  R5: ["start", "phone"],
  R6: ["chargeClip", "bossAttackClip"],
  R7: ["menuHeroes", "menuStage", "pick"],
  R8: ["start", "siege", "bossArrival"],
  R9: ["start", "bossArrival", "menuStart"],
};
