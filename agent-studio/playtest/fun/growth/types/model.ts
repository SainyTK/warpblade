export type CardPolicy = "random" | "strongest";

export interface Crowd {
  foesInReach: number;
  hitsPerFoe: number;
  minionShare: number;
}

export interface Chest {
  level: number;
  wave: number;
  least: number;
}

export type StepKind = "field" | "elite" | "mini" | "boss";

export interface StageStep {
  kind: StepKind;
  at: number;
  from: number;
  to: number;
  seconds: number;
  chests: readonly Chest[];
  foes: readonly string[];
  bigFoe: string | null;
}

export interface StagePlan {
  id: string;
  parSeconds: number;
  hazard: boolean;
  steps: readonly StageStep[];
  sides: readonly { id: string; seconds: number }[];
  openingActEnd: number;
  bossStep: number;
  openingLevel: number;
  bossLevel: number;
  foeHpGrowth: number;
}

export interface FirstSeen {
  id: string;
  seconds: number;
}

export interface RunRecord {
  hero: string;
  policy: CardPolicy;
  seed: number;
  stage: string;
  finalLevel: number;
  heroDpsGrowth: number;
  heroDpsGrowthLowCrowd: number;
  heroDpsGrowthHighCrowd: number;
  foeHpGrowth: number;
  parSeconds: number;
  fullAtSeconds: number | null;
  picks: number;
  picksBeforeFull: number;
  chests: number;
  chestUpgrades: number;
  chestEvolutions: number;
  core: string;
  skillsFirstOffered: readonly FirstSeen[];
  evolutions: readonly FirstSeen[];
}

export interface StageNovelty {
  stage: string;
  minutes: number;
  world: Record<string, number>;
  skills: number;
  evolutions: number;
  runs: number;
  perTenMinutes: number;
}

export interface GrowthSample {
  root: string;
  outDir: string;
  measures: readonly string[];
  heroes: readonly string[];
  runs: number;
}

export interface GrowthData {
  plans: readonly StagePlan[];
  randomRuns: readonly RunRecord[];
  strongestRuns: readonly RunRecord[];
  novelty: readonly StageNovelty[];
}
