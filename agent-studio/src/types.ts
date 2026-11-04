import type { PatchKind } from "../../src/types/patch.ts";

export type Role = "triage" | "director" | "developer" | "qa" | "media" | "writer";
export type RunMode = "live" | "dry";
export type SchemaName = "triage" | "plan" | "develop" | "qa" | "media" | "write" | "patch";

export interface RoleConfig {
  /** allowed built-in tools, or the default set */
  tools: string[] | "default";
  permission: "dontAsk" | "acceptEdits" | "bypassPermissions";
  minutes: number;
  schema: SchemaName;
}

export interface RunOptions {
  mode: RunMode;
  kind: PatchKind | "auto";
  /** the Bangkok day the patch is for, YYYY-MM-DD */
  date: string;
  /** the checkout the studio builds in, already at the base commit */
  workdir: string;
  runsDir: string;
  /** "api", or a JSON file of feedback items for a dry run */
  feedback: string;
}

/** everything a night's run knows before agents start; saved as context.json in the run folder */
export interface RunContext {
  mode: RunMode;
  kind: PatchKind;
  version: string;
  date: string;
  workdir: string;
  runDir: string;
  branch: string;
  baseSha: string;
  lastTag: string | null;
  previousVersions: string[];
}

export interface TriageItem {
  id: number;
  decision: "now" | "later" | "skip" | "duplicate" | "hide";
  duplicateOf: number | null;
  summary: string;
  reply: string;
  weight: "high" | "medium" | "low";
  reason: string;
}

export interface Plan {
  kind: PatchKind;
  title: string;
  theme: string;
  headline: {
    category: string;
    name: string;
    pitch: string;
    design: string;
    acceptance: string[];
    feedback: number[];
  } | null;
  changes: { type: string; target: string; change: string; reason: string; evidence: string; feedback: number[] }[];
  considered: { idea: string; whyNot: string }[];
  media: { subject: string; shot: string }[];
  roadmapNotes: string;
  memo: string;
}

export interface DevReport {
  summary: string;
  delivered: { item: string; files: string[]; notes: string }[];
  notDelivered: { item: string; why: string }[];
  checks: { typecheck: boolean; lint: boolean; build: boolean; smoke: boolean };
  knownIssues: string[];
}

export interface QaReport {
  verdict: "pass" | "fail";
  checks: { name: string; result: "pass" | "fail" | "skipped"; evidence: string }[];
  issues: { severity: "blocker" | "major" | "minor"; description: string; reproduce: string }[];
}

export interface MediaItem {
  subject: string;
  kind: "video" | "image";
  file: string;
  poster: string | null;
  gif: string | null;
  alt: string;
  width: number;
  height: number;
}

export interface WriterReply {
  id: number;
  reply: string;
}

export interface AgentResult<T> {
  sessionId: string | null;
  output: T;
  costUsd: number;
}

/** one night's run: its context, its files and what each agent cost */
export interface Night {
  ctx: RunContext;
  files: import("./runFiles.ts").RunFiles;
  costs: Record<string, number>;
}
