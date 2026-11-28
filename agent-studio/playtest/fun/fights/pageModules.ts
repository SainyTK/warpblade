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
