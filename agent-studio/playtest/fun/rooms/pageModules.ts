export interface FoeFields {
  type: string;
  rank: string;
  x: number;
  y: number;
  hp: number;
  max: number;
  state: string;
}

export interface BuildFields {
  arts: Record<string, number>;
  evolved: string[];
}

export interface StateModule {
  game: { mode: string; wave: number; enemies: FoeFields[] };
  hero: { x: number; y: number; vx: number; vy: number; hp: number; mp: number; state: string };
  progress: {
    level: number;
    picks: number;
    xp: number;
    heartShards: number;
    manaShards: number;
    stats: { hp: number; mp: number };
    build: BuildFields;
  };
  character: unknown;
  rng: unknown;
}

export interface ProgressModule {
  gainXp(amount: number): void;
  openPicks(): void;
  refreshGrowing(): void;
}

export interface ProgressionModule {
  xpToReach(level: number): number;
}

export interface StageModsModule {
  bandWave(level: number): number;
  stageMods(stage: StageFields, hyper: boolean): { hp: number; eliteEvery: number };
}

export interface RouteFoeFields {
  elite?: boolean;
  xp: number;
}

export interface RoutePackFields {
  foes: readonly RouteFoeFields[];
  mini?: { xp: number };
}

export type RoomBeatFields =
  | { kind: "surge"; waves: readonly number[]; to: number }
  | { kind: "elite" | "mini" | "boss"; foe: string; level: number; xp: number };

export interface RouteAreaFields {
  entrance: number;
  beats: readonly RoomBeatFields[];
  packs: readonly RoutePackFields[];
}

export interface RouteFields {
  areas: readonly RouteAreaFields[];
  walls: readonly { x0: number; x1: number; y: number }[];
}

export interface RouteModule {
  buildRoute(stage: StageFields, mods: unknown, random: unknown): RouteFields;
}

export interface TrailFields {
  route: RouteFields;
  mods: { hp: number };
  area: number;
  pack: number;
  packFoes: unknown[];
  hold: number | null;
  gate: number | null;
  finale: boolean;
  bigFoe: FoeFields | null;
}

export interface TrailModule {
  trail: TrailFields | null;
}

export interface StageFields {
  id: string;
  name: string;
  kind: string;
}

export interface StagesModule {
  STAGES: Record<string, StageFields>;
}

export interface StageTierModule {
  STAGE_TIER: Record<string, number>;
}

export interface StageArcModule {
  TIME_TO_KILL: Record<string, number>;
}

export interface VitalsModule {
  SHARD_DROP: { eliteChance: number; minionChance: number };
}

export interface EnemiesModule {
  ENEMIES: Record<string, { name: string }>;
}

export interface RngModule {
  Rng: new (seed: number) => unknown;
}

export type ChestRewardFields = { type: "evolve" | "skill" | "art" | "mastery"; id: string } | { type: "heal" };

export interface ChestsModule {
  rollChest(
    character: unknown,
    build: BuildFields,
    wave: number,
    luck: number,
    rng: unknown,
    least: number,
  ): ChestRewardFields[];
}

export interface RaiseModule {
  evolveSkill(id: string): void;
  raiseSkill(id: string): void;
  raiseArt(id: string): void;
  raiseMastery(id: string): void;
}

export interface BuildStatsModule {
  currentBuildStats(): { luck: number };
}

export interface GrowthModule {
  MAX_LEVEL: number;
}

export interface WavesModule {
  STAGE_WAVES: number;
}

export interface CardsModule {
  cardCount(luck: number, rng: unknown): number;
  dealCards(
    character: unknown,
    view: unknown,
    rng: unknown,
    count: number,
    boons: unknown,
    without: readonly string[],
  ): unknown[];
}

export interface CardViewModule {
  cardView(): unknown;
}

export interface BoonsModule {
  BOONS: unknown;
}

export interface CardFaceModule {
  cardFace(character: unknown, card: unknown, build: unknown): unknown;
}

export interface PickCardModule {
  pickCard(face: unknown, index: number): HTMLElement;
}

export interface PickAnswerModule {
  answerPick(answer: { t: "take"; card: unknown }): void;
}
