export interface CommonFlags {
  root: string;
}
export interface SmokeFlags extends CommonFlags {
  hero: string;
}

import type { RunStart } from "./session";

export interface BotFlags extends CommonFlags {
  hero: string;
  start?: RunStart;
  runs: number;
  policy: string;
  maxMinutes: number;
}
export interface ScenarioFlags extends CommonFlags {
  file: string;
  hero?: string;
  viewport?: string;
  start?: RunStart;
  /** wall-clock minutes before the script is given up as frozen */
  maxMinutes: number;
}
