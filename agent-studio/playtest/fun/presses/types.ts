export type PressAction = "J" | "K" | "L" | "I" | "U" | "jump";
export type PressTiming = "100ms" | "after";

export interface FighterProbe {
  t: number;
  state: string;
  x: number;
  y: number;
  vy: number;
  face: number;
  ground: boolean;
  mp: number;
  hp: number;
  maxHp: number;
  swing: string | null;
  swingAge: number;
  dash: number;
  guard: boolean;
  warp: string | null;
  release: boolean;
  infusion: boolean;
  skillCast: boolean;
}

export interface PairTrial {
  pair: string;
  hero: string;
  timing: PressTiming;
  firstStarted: boolean;
  secondStarted: boolean;
  secondAtMs: number | null;
  mpBefore: number;
  disturbed: boolean;
  retried: boolean;
}

export interface ResponseTrial {
  hero: string;
  action: PressAction;
  phase: number;
  ms: number | null;
  disturbed: boolean;
  retried: boolean;
}

export interface ResponseTiming {
  ms: number | null;
  disturbed: boolean;
}

export interface HeroPresses {
  hero: string;
  pairs: PairTrial[];
  responses: ResponseTrial[];
  reopens: number;
  errors: string[];
}

export interface DrillModule {
  drillFighter(): {
    swing?: { kind: string; age: number } | null;
    dashTime?: number;
    guardAge?: number | null;
    parryAge?: number | null;
    warp?: { phase: string } | null;
    spellRelease?: unknown;
    swordInfusion?: unknown;
    skillCast?: unknown;
  } | null;
}

export interface FighterStateModule {
  hero: { state: string; x: number; y: number; vy: number; face: number; ground: boolean; mp: number; hp: number };
  progress: { stats: { hp: number } };
}

export interface HeroBench {
  hero: string;
  presses: HeroPresses | null;
  failure: string | null;
}
