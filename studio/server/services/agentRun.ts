// Ported from the PWA Chat service (system/pwa/backend/chat/src/services/agent-run.ts):
// one Claude Code process per job, fed through streaming input, behind the CLIProxyAPI proxy.
import { randomUUID } from 'node:crypto';
import {
  type CanUseTool,
  type PermissionResult,
  type PermissionUpdate,
  type Query,
  query,
  type SDKMessage,
  type SDKUserMessage,
} from '@anthropic-ai/claude-agent-sdk';
import type { ApprovalDecision, ApprovalItem, ImageRef, RunState } from '../../shared/api';
import type { PermissionModeId } from '../../shared/permissionModes';
import { INHERITED_ENV, RUN_IDLE_MS, STOP_GRACE_MS, STUDIO_SYSTEM_PROMPT } from '../constants';
import type { JobChannel } from '../state/jobChannel';
import {
  modeAfterPlan,
  PLAN_TOOL,
  permissionResult,
  planText,
  QUESTION_TOOL,
  questions,
} from '../utils/approvals';
import type { LiveTimeline } from '../utils/liveTimeline';
import { MessageQueue } from '../utils/messageQueue';

export interface AgentRuntime {
  claudePath: string;
  claudeConfigDir: string;
  proxyUrl: string;
  proxyKey: () => string;
}

export interface RunStart {
  sessionId: string;
  /** True once the session exists: the agent loads its transcript and appends to it. */
  resume: boolean;
  cwd: string;
  model: string;
  permissionMode: PermissionModeId;
}

/** A turn's content: the text and any image blocks, such as the sketch's contact sheets. */
export interface Prompt {
  text: string;
  blocks: { type: 'image'; source: { type: 'base64'; media_type: 'image/png'; data: string } }[];
  images: ImageRef[];
  model: string;
  permissionMode: PermissionModeId;
}

interface PendingApproval {
  item: ApprovalItem;
  input: Record<string, unknown>;
  suggestions: PermissionUpdate[];
  resolve: (result: PermissionResult) => void;
}

export class RunBusyError extends Error {}

/** The agent process environment: ordinary platform variables plus the proxy. No API key or login token passes. */
function agentEnvironment(runtime: AgentRuntime): Record<string, string> {
  const env: Record<string, string> = {};
  for (const name of INHERITED_ENV) {
    const value = process.env[name];
    if (value !== undefined) {
      env[name] = value;
    }
  }
  env.CLAUDE_CONFIG_DIR = runtime.claudeConfigDir;
  env.ANTHROPIC_BASE_URL = runtime.proxyUrl;
  env.ANTHROPIC_AUTH_TOKEN = runtime.proxyKey();
  env.CLAUDE_AGENT_SDK_CLIENT_APP = 'warpblade-studio';
  return env;
}

/**
 * One Claude Code process for one job. Follow-up turns, approvals, mode changes and Stop reach the same process.
 * It closes after a quiet period; the next message resumes the session.
 */
export class AgentRun {
  state: RunState;
  activePrompt: string | null = null;
  private readonly input = new MessageQueue<SDKUserMessage>();
  private readonly approvals = new Map<string, PendingApproval>();
  private agent: Query | null = null;
  private stopping = false;
  private closed = false;
  private idleTimer: NodeJS.Timeout | null = null;
  private stopTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly runtime: AgentRuntime,
    private readonly start: RunStart,
    private readonly timeline: LiveTimeline,
    private readonly channel: JobChannel,
    private readonly onTurnEnd: () => void,
    private readonly onClose: (run: AgentRun) => void,
  ) {
    this.state = { status: 'starting', model: start.model, permissionMode: start.permissionMode };
  }

  private setState(change: Partial<RunState>): void {
    this.state = { ...this.state, ...change };
    this.channel.publish({ type: 'run', run: this.state });
  }

  launch(): void {
    const canUseTool: CanUseTool = (toolName, toolInput, options) =>
      this.requestApproval(toolName, toolInput, options);
    this.agent = query({
      prompt: this.input,
      options: {
        cwd: this.start.cwd,
        model: this.start.model,
        permissionMode: this.start.permissionMode,
        // Claude Code accepts a switch to bypass, at launch or later, only with this flag. It does not turn bypass on.
        allowDangerouslySkipPermissions: true,
        ...(this.start.resume
          ? { resume: this.start.sessionId }
          : { sessionId: this.start.sessionId }),
        pathToClaudeCodeExecutable: this.runtime.claudePath,
        env: agentEnvironment(this.runtime),
        // The flag layer outranks user and project settings, so a settings file cannot point agents elsewhere.
        settings: { env: { ANTHROPIC_BASE_URL: this.runtime.proxyUrl } },
        settingSources: ['user', 'project', 'local'],
        systemPrompt: { type: 'preset', preset: 'claude_code', append: STUDIO_SYSTEM_PROMPT },
        includePartialMessages: true,
        thinking: { type: 'adaptive', display: 'summarized' },
        canUseTool,
      },
    });
    this.channel.publish({ type: 'run', run: this.state });
    void this.consume(this.agent);
  }

  private async consume(agent: Query): Promise<void> {
    try {
      for await (const message of agent) {
        this.handle(message);
      }
    } catch (problem) {
      if (!this.closed) {
        const reason = problem instanceof Error ? problem.message.split('\n')[0] : '';
        this.timeline.notice(
          'error',
          `Claude Code stopped unexpectedly${reason ? `: ${reason}` : ''}. Send a message to resume.`,
        );
      }
    } finally {
      this.close();
    }
  }

  private handle(message: SDKMessage): void {
    if (
      message.type === 'system' &&
      message.subtype === 'init' &&
      this.state.status === 'starting'
    ) {
      this.setState({ status: this.activePrompt ? 'running' : 'idle' });
    }
    const turnEnded = this.timeline.apply(message);
    if (!turnEnded || message.type !== 'result') {
      return;
    }
    if (this.stopping) {
      this.timeline.notice('info', 'Stopped');
    } else if (message.subtype !== 'success') {
      this.timeline.notice('error', 'The turn ended with an error. Send a message to continue.');
    } else if (message.is_error) {
      this.timeline.notice('error', message.result.trim() || 'The model request failed.');
    }
    this.finishTurn();
  }

  private finishTurn(): void {
    this.stopping = false;
    this.activePrompt = null;
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.setState({ status: 'idle' });
    this.onTurnEnd();
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => this.close(), RUN_IDLE_MS);
    this.idleTimer.unref();
  }

  /** Sends the next turn. */
  async send(prompt: Prompt): Promise<void> {
    if (this.closed || this.activePrompt) {
      throw new RunBusyError('The agent is still working. Wait for it or press Stop.');
    }
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.agent && prompt.model !== this.state.model) {
      await this.agent.setModel(prompt.model);
    }
    if (this.agent && prompt.permissionMode !== this.state.permissionMode) {
      await this.agent.setPermissionMode(prompt.permissionMode);
    }
    const uuid = randomUUID();
    this.activePrompt = uuid;
    this.timeline.upsert({ kind: 'user', id: uuid, text: prompt.text, images: prompt.images });
    this.input.push({
      type: 'user',
      uuid,
      message: {
        role: 'user',
        content: [{ type: 'text' as const, text: prompt.text }, ...prompt.blocks],
      },
      parent_tool_use_id: null,
    } as SDKUserMessage);
    this.setState({
      status: this.state.status === 'starting' ? 'starting' : 'running',
      model: prompt.model,
      permissionMode: prompt.permissionMode,
    });
  }

  async setPermissionMode(mode: PermissionModeId): Promise<void> {
    if (this.agent && mode !== this.state.permissionMode) {
      await this.agent.setPermissionMode(mode);
    }
    this.setState({ permissionMode: mode });
  }

  private requestApproval(
    toolName: string,
    toolInput: Record<string, unknown>,
    options: Parameters<CanUseTool>[2],
  ): Promise<PermissionResult> {
    const id = `approval-${options.toolUseID}`;
    const item: ApprovalItem = {
      kind: 'approval',
      id,
      toolUseId: options.toolUseID,
      toolName,
      title: options.title ?? `Allow ${options.displayName ?? toolName}?`,
      description: options.description ?? options.decisionReason ?? null,
      input: toolInput,
      canAlwaysAllow: options.suppressAlwaysAllowRule !== true && toolName !== QUESTION_TOOL,
      status: 'pending',
      plan: planText(toolName, toolInput),
      questions: questions(toolName, toolInput),
    };
    this.timeline.upsert(item);
    this.setState({ status: 'waiting' });
    return new Promise((resolve) => {
      this.approvals.set(id, {
        item,
        input: toolInput,
        suggestions: options.suggestions ?? [],
        resolve,
      });
      options.signal.addEventListener('abort', () =>
        this.settle(id, 'cancelled', { behavior: 'deny', message: 'Cancelled.' }),
      );
    });
  }

  private settle(id: string, status: ApprovalItem['status'], result: PermissionResult): boolean {
    const pending = this.approvals.get(id);
    if (!pending) {
      return false;
    }
    this.approvals.delete(id);
    this.timeline.upsert({ ...pending.item, status });
    pending.resolve(result);
    if (!this.approvals.size && this.activePrompt && !this.closed) {
      this.setState({ status: 'running' });
    }
    return true;
  }

  /** The owner's answer to a pending approval. Returns false when it is no longer pending. */
  decide(id: string, decision: ApprovalDecision, answers: Record<string, string> | null): boolean {
    const pending = this.approvals.get(id);
    if (!pending) {
      return false;
    }
    const { toolName, toolUseId } = pending.item;
    const result = permissionResult({
      toolName,
      toolInput: pending.input,
      toolUseId,
      decision,
      suggestions: pending.suggestions,
      answers,
    });
    const status = decision === 'deny' ? 'denied' : decision === 'always' ? 'always' : 'allowed';
    this.settle(id, status, result);
    const nextMode = toolName === PLAN_TOOL ? modeAfterPlan(decision) : null;
    if (nextMode) {
      this.setState({ permissionMode: nextMode });
    }
    return true;
  }

  /** Stops the turn: pending approvals are cancelled and the turn interrupted, then the process closes if it hangs. */
  async stop(): Promise<void> {
    if (!this.activePrompt || this.closed) {
      return;
    }
    this.stopping = true;
    for (const id of [...this.approvals.keys()]) {
      this.settle(id, 'cancelled', {
        behavior: 'deny',
        message: 'The owner stopped the turn.',
        interrupt: true,
      });
    }
    this.stopTimer = setTimeout(() => this.close(), STOP_GRACE_MS);
    try {
      await this.agent?.interrupt();
    } catch {
      this.close();
    }
  }

  /** Ends the process. Its child processes end with it. */
  close(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const timer of [this.idleTimer, this.stopTimer]) {
      if (timer) {
        clearTimeout(timer);
      }
    }
    for (const id of [...this.approvals.keys()]) {
      this.settle(id, 'cancelled', { behavior: 'deny', message: 'The session closed.' });
    }
    if (this.activePrompt && this.stopping) {
      this.timeline.notice('info', 'Stopped');
    }
    this.activePrompt = null;
    this.input.end();
    this.agent?.close();
    this.channel.publish({ type: 'run', run: null });
    this.onClose(this);
  }
}
