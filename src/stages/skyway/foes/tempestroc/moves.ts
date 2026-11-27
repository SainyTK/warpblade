import { BOSS_PHASES } from "../../../../constants/bossFight";
import { GROUND } from "../../../../constants/stage";
import type { Enemy } from "../../../../types/enemy";

export const ROC_HITS = { swoop: 22, bolt: 18, feather: 11, breath: 20 } as const;
export const ROC_WINDUP = { gust: 0.85, swoop: 1.05, strikes: 0.6, volley: 0.7, breath: 1 } as const;
export const ROC_STORM_WINDUP = 0.82;
export const ROC_TIMES = {
  gust: 1.7,
  gustStorm: 2.4,
  strikeMark: 1.05,
  strikeMarkStorm: 0.9,
  strikeGap: 0.16,
  strikesDone: 1.6,
  volleyHold: 0.35,
  breath: 1.35,
  roar: 1.4,
  recover: 0.75,
} as const;
export const ROC_ENRAGE = BOSS_PHASES.second;
export const ROC_HOVER = { height: 62, keep: 96, speed: 85, low: GROUND - 58 } as const;
export const GUST_PUSH = { ground: 64, groundStorm: 96, air: 560, airStorm: 820 } as const;
export const SWOOP = { top: 44, low: GROUND - 13, speed: 280, edge: 26 } as const;
export const STRIKE_SPREAD = 44;
export const FEATHERS = { calm: 5, storm: 7, fan: 0.34, speed: 150 } as const;
export const BREATH = { reach: 26, edge: 16 } as const;
export const ROC_COOLDOWN = { least: 0.9, most: 1.5, storm: 0.7 } as const;
export const ROC_GLOW = { calm: 44, storm: 60 } as const;

export type RocMove = "gust" | "swoop" | "strikes" | "volley" | "breath";

export const stormy = (e: Enemy): boolean => e.phase === 2;
export const roaring = (e: Enemy): boolean => e.state === "blink";
export const stormWindup = (e: Enemy): number => (stormy(e) ? ROC_STORM_WINDUP : 1);
