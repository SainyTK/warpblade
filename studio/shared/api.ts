// The JSON between the studio page and its server.
import type { PermissionModeId } from './permissionModes';
import type { Sketch } from './sketch';

export interface ModelInfo {
  id: string;
  label: string;
}

export interface StudioSettings {
  models: ModelInfo[];
  defaultModel: string | null;
  /** Set when the agent proxy cannot be reached or refused the key. No agent can start until it clears. */
  proxyError: string | null;
}

export interface ImageRef {
  src: string;
  alt: string;
}

export interface UserItem {
  kind: 'user';
  id: string;
  text: string;
  images: ImageRef[];
}

export interface TextItem {
  kind: 'text';
  id: string;
  text: string;
}

export interface ThinkingItem {
  kind: 'thinking';
  id: string;
  text: string;
}

export interface ToolResult {
  text: string;
  isError: boolean;
  images: ImageRef[];
}

export interface ToolItem {
  kind: 'tool';
  id: string;
  name: string;
  input: unknown;
  status: 'running' | 'done' | 'error';
  result: ToolResult | null;
}

export type ApprovalDecision = 'allow' | 'always' | 'deny';
export type ApprovalStatus = 'pending' | 'allowed' | 'always' | 'denied' | 'cancelled';

export interface QuestionOption {
  label: string;
  description: string;
}

export interface Question {
  question: string;
  header: string;
  multiSelect: boolean;
  options: QuestionOption[];
}

export interface ApprovalItem {
  kind: 'approval';
  id: string;
  toolUseId: string;
  toolName: string;
  title: string;
  description: string | null;
  input: unknown;
  canAlwaysAllow: boolean;
  status: ApprovalStatus;
  plan: string | null;
  questions: Question[] | null;
}

export interface NoticeItem {
  kind: 'notice';
  id: string;
  tone: 'info' | 'error';
  text: string;
}

export type TimelineItem =
  | UserItem
  | TextItem
  | ThinkingItem
  | ToolItem
  | ApprovalItem
  | NoticeItem;

export type RunStatus = 'starting' | 'running' | 'waiting' | 'idle';

export interface RunState {
  status: RunStatus;
  model: string;
  permissionMode: PermissionModeId;
}

/** Where a job's agent works: a fresh git worktree on its own branch, or the repo's own checkout. */
export type JobTarget = 'worktree' | 'checkout';

export interface PreviewState {
  status: 'starting' | 'ready' | 'failed';
  url: string | null;
  error: string | null;
}

export interface JobSummary {
  id: string;
  title: string;
  createdAt: string;
  sketchId: string;
  sketchName: string;
  target: JobTarget;
  branch: string | null;
  /** The agent's working folder, relative to the home folder, for display. */
  workdir: string;
  /** The model and mode the job last used, for its next message. */
  model: string;
  permissionMode: PermissionModeId;
  run: RunState | null;
  preview: PreviewState | null;
}

export interface JobView extends JobSummary {
  items: TimelineItem[];
  /** The first prompt the server wrote for the agent, from the sketch and the owner's instruction. */
  brief: string;
  epoch: string;
  seq: number;
}

/** A PNG the page rendered from the sketch, sent with a new job. */
export interface ExportImage {
  name: string;
  dataUrl: string;
}

export interface JobRequest {
  sketch: Sketch;
  instruction: string;
  include: { motion: boolean; effect: boolean };
  model: string;
  permissionMode: PermissionModeId;
  target: JobTarget;
  images: ExportImage[];
}

export interface TurnRequest {
  text: string;
  model: string;
  permissionMode: PermissionModeId;
}

export interface DecisionRequest {
  decision: ApprovalDecision;
  answers: Record<string, string> | null;
}

export type JobEventBody =
  | { type: 'upsert'; item: TimelineItem }
  | { type: 'append'; id: string; text: string }
  | { type: 'run'; run: RunState | null }
  | { type: 'preview'; preview: PreviewState | null }
  /** The job's folder is ready: a new worktree on its branch, or the checkout. */
  | { type: 'place'; branch: string | null; workdir: string }
  | { type: 'reset' };

export type JobEvent = JobEventBody & { seq: number };
