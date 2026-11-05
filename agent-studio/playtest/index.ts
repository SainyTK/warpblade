/** The playtest library: open the game, play it with real keys, read its state, take stills and record clips. */
export { autopilot } from "./bots/autopilot";
export { POLICIES, policyByName } from "./bots/policies";
export { KEYS } from "./constants/keys";
export { type Harness, launchHarness } from "./session/harness";
export { openGame } from "./session/openGame";
export type { Policy, PolicyName } from "./types/bot";
export type { BotReport, BotRun, ScenarioReport, SmokeReport } from "./types/report";
export type {
  OpenGameOptions,
  RecordOptions,
  RecordResult,
  Session,
  StillResult,
  Viewport,
} from "./types/session";
export type { FoeSnapshot, GameSnapshot, HeroInfo, HeroSnapshot, HudSnapshot } from "./types/snapshot";
