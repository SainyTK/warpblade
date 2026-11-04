export interface Check {
  name: string;
  hero?: string;
  ok: boolean;
  /** skipped checks count as passed */
  skipped?: boolean;
  detail?: string;
}
interface ReportBase {
  command: string;
  ok: boolean;
  root: string;
  startedAt: string;
  wallSeconds: number;
  pageErrors: string[];
}
export interface SmokeReport extends ReportBase {
  command: "smoke";
  heroes: string[];
  checks: Check[];
}
export type RunEnding = "fallen" | "clear" | "timeout";
export interface BotRun {
  hero: string;
  policy: string;
  wave: number;
  level: number;
  kills: number;
  coins: number;
  /** game seconds from the first step of the run to its end */
  seconds: number;
  wallSeconds: number;
  ending: RunEnding;
  /** HP lost in each wave, by wave number */
  hpLostByWave: Record<string, number>;
  picks: string[];
}
export interface BotMeans {
  hero: string;
  runs: number;
  wave: number;
  level: number;
  kills: number;
  coins: number;
  seconds: number;
}
export interface BotReport extends ReportBase {
  command: "bot";
  policy: string;
  runs: BotRun[];
  means: BotMeans[];
  determinism: string;
}
export interface ScenarioReport extends ReportBase {
  command: "scenario";
  file: string;
  result: unknown;
  error?: string;
}
export type Report = SmokeReport | BotReport | ScenarioReport;
