import type { Harness } from "../../session/harness";
import type { Session } from "../../types/session";
import type { GameSnapshot } from "../../types/snapshot";
import type { DefenseView } from "../defense";
import type { EvidenceItem } from "../types";

export type PlayEnd = "reached" | "ended" | "timeout";

export interface PlayResult {
  end: PlayEnd;
  state: GameSnapshot;
  view: DefenseView;
}

export interface PlayOptions {
  until: (state: GameSnapshot, view: DefenseView) => boolean;
  limitMs: number;
}

export interface Album {
  still(session: Session, name: string, shows: string): Promise<void>;
  window(session: Session, name: string, shows: string): Promise<void>;
  clip(session: Session, name: string, shows: string, play: () => Promise<void>, width?: number): Promise<void>;
  assisted(how: string): void;
  note(text: string): void;
  items(): EvidenceItem[];
  notes(): string[];
}

export interface Scene {
  name: string;
  run(harness: Harness, album: Album): Promise<void>;
}

export type ShotKind =
  | "start"
  | "fight"
  | "combatClip"
  | "hitClip"
  | "siege"
  | "bossArrival"
  | "bossFight"
  | "bossAttackClip"
  | "chargeClip"
  | "result"
  | "pick"
  | "menuStart"
  | "menuHeroes"
  | "menuStage"
  | "phone";

export type ShotPlan = ReadonlySet<ShotKind>;

export interface SceneSubject {
  hero: string;
  stage: string;
  lead: boolean;
  plan: ShotPlan;
}

export interface GameStateModule {
  progress: {
    heartShards: number;
    manaShards: number;
  };
}

export interface ProgressModule {
  refreshGrowing(): void;
  openPicks(): void;
}
