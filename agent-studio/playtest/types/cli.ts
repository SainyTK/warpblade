export interface CommonFlags {
  root: string;
}
export interface SmokeFlags extends CommonFlags {
  hero: string;
}
export interface BotFlags extends CommonFlags {
  hero: string;
  runs: number;
  policy: string;
  maxMinutes: number;
}
export interface ScenarioFlags extends CommonFlags {
  file: string;
  hero?: string;
  viewport?: string;
}
