import { homedir } from "node:os";
import { join } from "node:path";
import type { Role, RoleConfig } from "./types.ts";

export const TIMEZONE = "Asia/Bangkok";
/** a big patch ships when this many days have passed since the last one */
export const BIG_PATCH_EVERY_DAYS = 3;
/** the hero sprint: until the game has this many heroes, every night is a big patch that adds one (charter) */
export const HERO_ROSTER_TARGET = 10;
/** the hero list the sprint counts, relative to the checkout */
export const ROSTER_FILE = "src/constants/characters/index.ts";
export const REPO_SLUG = "SainyTK/warpblade";
export const SITE_URL = "https://warpblade.sainytk.com";
export const MAIN_BRANCH = "main";
export const BRANCH_PREFIX = "studio/patch-";

export const CLAUDE_BIN = process.env.STUDIO_CLAUDE ?? join(homedir(), ".local/bin/claude-pool");
export const MODEL = process.env.STUDIO_MODEL ?? "claude-opus-5-5";

/** a failed QA gets this many rounds of fixes before the night is called off */
export const MAX_FIX_ROUNDS = 2;
/** bot runs per hero for the baseline difficulty report */
export const BASELINE_BOT_RUNS = 1;

/** paths only the owner changes; a patch that touches them is refused */
export const PROTECTED_PATHS = [
  "agent-studio/charter.md",
  "agent-studio/src/",
  "agent-studio/roles/",
  "agent-studio/schemas/",
  "agent-studio/playtest/",
  "agent-studio/package.json",
  "agent-studio/package-lock.json",
  "agent-studio/biome.json",
  "agent-studio/tsconfig.json",
  "vercel.json",
  ".github/",
];

/** what each role may touch: its tools, how it asks for permission and how long it may run */
export const ROLES: Record<Role, RoleConfig> = {
  triage: { tools: [], permission: "dontAsk", minutes: 15, schema: "triage" },
  director: { tools: ["Read", "Grep", "Glob"], permission: "dontAsk", minutes: 45, schema: "plan" },
  developer: { tools: "default", permission: "bypassPermissions", minutes: 240, schema: "develop" },
  qa: { tools: "default", permission: "bypassPermissions", minutes: 75, schema: "qa" },
  media: { tools: "default", permission: "bypassPermissions", minutes: 75, schema: "media" },
  writer: { tools: ["Read", "Write", "Edit", "Grep", "Glob"], permission: "acceptEdits", minutes: 40, schema: "write" },
};
/** a small patch gives the developer less time */
export const SMALL_PATCH_DEVELOPER_MINUTES = 120;
/** how often an agent's time limit is checked; a longer gap between checks means the Mac slept, and sleep does not count */
export const AGENT_CLOCK_TICK_MS = 15_000;
/** an agent that ran out of time gets this long, in its resumed session, to commit and give its answer */
export const WRAP_UP_MINUTES = 20;

/** the label on feedback issues the studio means to do */
export const PLANNED_LABEL = "planned";
/** the most feedback issues read in one night */
export const FEEDBACK_LIMIT = 200;
/** longer issue bodies are cut before triage reads them */
export const FEEDBACK_BODY_MAX = 4000;

/** what players see on feedback the studio means to do but did not ship tonight */
export const PLANNED_REPLY = "The studio plans to work on this in an upcoming patch.";
