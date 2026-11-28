export type BigFoeKind = "elite" | "mini" | "boss";

export type FightKind = Exclude<BigFoeKind, "elite">;

export type DefenseEnd = "held" | "shattered";

export interface BigFoeView {
  kind: BigFoeKind;
  type: string;
  hp: number;
  max: number;
}

export interface DefenseView {
  stage: string | null;
  stageName: string;
  bossName: string;
  elapsed: number;
  end: DefenseEnd | null;
  crystalShare: number;
  crystalStruck: boolean;
  crystalX: number;
  bigFoes: BigFoeView[];
  mode: string;
  heroX: number;
  heroY: number;
  heroHp: number;
  heroMaxHp: number;
  dead: boolean;
  picks: number;
  level: number;
}

export interface PlanStep {
  level: number;
  chests: number;
  least: number;
}

export interface FightPlan {
  id: string;
  stage: string;
  stageName: string;
  kind: FightKind;
  foe: string;
  foeName: string;
  tier: number;
  callAt: number;
  section: number;
  startAt: number;
  level: number;
  hearts: number;
  manas: number;
  steps: PlanStep[];
  designedKillSeconds: number;
}
