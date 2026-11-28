import type { Harness } from "../../session/harness";
import type { Session } from "../../types/session";
import type { GameSnapshot } from "../../types/snapshot";
import type { EvidenceItem } from "../types";

export interface TrailView {
  stage: string | null;
  area: number;
  beat: number;
  beatKind: string | null;
  bigFoeHp: number | null;
  surge: boolean;
  gate: number | null;
  hold: number | null;
  mentor: { x: number; y: number } | null;
  heroX: number;
  heroY: number;
  picks: number;
  level: number;
}

export type PlayEnd = "reached" | "ended" | "timeout";

export interface PlayResult {
  end: PlayEnd;
  state: GameSnapshot;
  trail: TrailView;
}

export interface PlayOptions {
  until: (state: GameSnapshot, trail: TrailView) => boolean;
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
  | "surge"
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

export interface TrailModule {
  trail: {
    route: {
      stage: { id: string; name: string; boss: string };
      areas: { entrance: number; packs: unknown[]; beats: { kind: string; foe?: string }[] }[];
    };
    area: number;
    beat: number;
    pack: number;
    hold: number | null;
    packFoes: unknown[];
    gate: number | null;
    surge: unknown;
    bigFoe: { hp: number } | null;
  } | null;
}

export interface MentorModule {
  stageMentor(): { x: number; y: number } | null;
}

export interface GameStateModule {
  game: { mode: string; enemies: unknown[] };
  hero: { x: number; y: number; hp: number; mp: number; vx: number; vy: number };
  progress: {
    picks: number;
    level: number;
    heartShards: number;
    manaShards: number;
    stats: { hp: number; mp: number };
  };
}

export interface ProgressModule {
  refreshGrowing(): void;
  openPicks(): void;
}

export interface EnemiesModule {
  ENEMIES: Record<string, { name: string }>;
}

export interface StageNames {
  stage: string;
  boss: string;
}
