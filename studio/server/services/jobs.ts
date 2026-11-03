import { randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import type {
  DecisionRequest,
  JobRequest,
  JobSummary,
  JobView,
  PreviewState,
  StudioSettings,
  TimelineItem,
  TurnRequest,
} from '../../shared/api';
import type { PermissionModeId } from '../../shared/permissionModes';
import { celRows } from '../../shared/utils/celRows';
import { clipSource } from '../../shared/utils/clipSource';
import { IMAGE_TYPES, MAX_ACTIVE_RUNS } from '../constants';
import { JobChannel } from '../state/jobChannel';
import type { StudioConfig } from '../types/config';
import type { JobRecord } from '../types/job';
import { buildBrief } from '../utils/brief';
import { imageSource } from '../utils/content';
import { StudioError } from '../utils/errors';
import { newId, slug } from '../utils/ids';
import { LiveTimeline } from '../utils/liveTimeline';
import { AgentRun, type AgentRuntime, type Prompt } from './agentRun';
import type { JobStore } from './jobStore';
import { Preview } from './previews';
import type { ProxyService } from './proxy';
import type { WorktreeService } from './worktrees';

/** Contact sheets the agent sees in its first message as well as on disk. */
const SHEETS = ['motion-keys.png', 'effect-cels.png'];
const SAVE_DELAY_MS = 2000;

interface Job {
  record: JobRecord;
  channel: JobChannel;
  timeline: LiveTimeline;
  run: AgentRun | null;
  preview: Preview | null;
  saveTimer: NodeJS.Timeout | null;
}

const displayPath = (path: string): string => path.replace(homedir(), '~');

function titleOf(instruction: string): string {
  const line = instruction.split('\n')[0]?.trim() ?? '';
  return line.length > 80 ? `${line.slice(0, 77)}...` : line;
}

/** The studio's agent jobs: each one a sketch handed to a Claude Code agent in its own worktree or the checkout. */
export class JobService {
  private readonly jobs = new Map<string, Job>();

  constructor(
    private readonly config: StudioConfig,
    private readonly store: JobStore,
    private readonly worktrees: WorktreeService,
    private readonly proxy: ProxyService,
  ) {}

  private get runtime(): AgentRuntime {
    return {
      claudePath: this.config.claudePath,
      claudeConfigDir: this.config.claudeConfigDir,
      proxyUrl: this.config.proxyUrl,
      proxyKey: () => this.proxy.key(),
    };
  }

  /** Loads jobs saved by earlier runs of the server. Their agents start again on the next message. */
  async load(): Promise<void> {
    for (const record of await this.store.records()) {
      this.add(record, await this.store.timeline(record.id));
    }
  }

  private add(record: JobRecord, items: TimelineItem[]): Job {
    const channel = new JobChannel();
    const job: Job = {
      record,
      channel,
      run: null,
      preview: null,
      saveTimer: null,
      timeline: new LiveTimeline(
        items,
        (event) => {
          channel.publish(event);
          this.scheduleSave(job);
        },
        (block) => this.keepImage(record.id, block),
      ),
    };
    this.jobs.set(record.id, job);
    return job;
  }

  private scheduleSave(job: Job): void {
    if (job.saveTimer) {
      return;
    }
    job.saveTimer = setTimeout(() => {
      job.saveTimer = null;
      void this.store.saveTimeline(job.record.id, job.timeline.list());
    }, SAVE_DELAY_MS);
  }

  /** Saves a tool result's image under the job's media and returns its URL. */
  private keepImage(id: string, block: Record<string, unknown>): string | null {
    const source = imageSource(block);
    const extension = source ? IMAGE_TYPES[source.mediaType] : undefined;
    if (!source || !extension) {
      return null;
    }
    const name = `${randomUUID()}.${extension}`;
    void this.store.saveMedia(id, name, Buffer.from(source.data, 'base64'));
    return `/api/jobs/${id}/media/${name}`;
  }

  private job(id: string): Job {
    const job = this.jobs.get(id);
    if (!job) {
      throw new StudioError(404, 'Unknown job.');
    }
    return job;
  }

  async settings(): Promise<StudioSettings> {
    const status = await this.proxy.status();
    const preferred = status.models.find((model) => model.id === this.config.defaultModel);
    return {
      models: status.models,
      defaultModel: preferred?.id ?? status.models[0]?.id ?? null,
      proxyError: status.error,
    };
  }

  private summary(job: Job): JobSummary {
    const { record } = job;
    return {
      id: record.id,
      title: record.title,
      createdAt: record.createdAt,
      sketchId: record.sketchId,
      sketchName: record.sketchName,
      target: record.target,
      branch: record.branch,
      workdir: displayPath(record.cwd),
      model: job.run?.state.model ?? record.model,
      permissionMode: job.run?.state.permissionMode ?? record.permissionMode,
      run: job.run?.state ?? null,
      preview: job.preview?.state ?? null,
    };
  }

  list(): JobSummary[] {
    return [...this.jobs.values()]
      .map((job) => this.summary(job))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  channel(id: string): JobChannel {
    return this.job(id).channel;
  }

  view(id: string): JobView {
    const job = this.job(id);
    return {
      ...this.summary(job),
      items: job.timeline.list(),
      brief: job.record.brief,
      epoch: job.channel.epoch,
      seq: job.channel.lastSeq,
    };
  }

  media(id: string, name: string) {
    this.job(id);
    return this.store.readMedia(id, name);
  }

  /** Starts a job: answers at once, then sets up the folder, writes the sketch files and sends the brief. */
  async create(request: JobRequest): Promise<JobSummary> {
    const settings = await this.settings();
    if (settings.proxyError) {
      throw new StudioError(503, settings.proxyError);
    }
    this.assertCapacity();
    const id = newId();
    const name = slug(request.sketch.name, id);
    const record: JobRecord = {
      id,
      title: titleOf(request.instruction),
      createdAt: new Date().toISOString(),
      sketchId: request.sketch.id,
      sketchName: request.sketch.name,
      target: request.target,
      branch: null,
      cwd: this.config.repoRoot,
      sessionId: randomUUID(),
      started: false,
      model: request.model,
      permissionMode: request.permissionMode,
      brief: '',
    };
    await this.store.create(record);
    const job = this.add(record, []);
    void this.setUp(job, request, name);
    return this.summary(job);
  }

  private async setUp(job: Job, request: JobRequest, name: string): Promise<void> {
    const { record } = job;
    try {
      if (request.target === 'worktree') {
        job.timeline.notice('info', `Creating worktree studio-${name} and installing packages`);
        const worktree = await this.worktrees.create(name);
        record.cwd = worktree.cwd;
        record.branch = worktree.branch;
      } else {
        record.branch = await this.worktrees.checkoutBranch();
      }
      job.channel.publish({
        type: 'place',
        branch: record.branch,
        workdir: displayPath(record.cwd),
      });
      const prompt = await this.writeExports(job, request);
      await this.store.saveRecord(record);
      await this.send(job, prompt);
    } catch (problem) {
      const message = problem instanceof Error ? problem.message : 'Setup failed.';
      job.timeline.notice('error', `Setup failed: ${message}`);
    }
  }

  /** Writes the sketch's files for the agent and returns the first prompt. */
  private async writeExports(job: Job, request: JobRequest): Promise<Prompt> {
    const { record } = job;
    const { sketch, include } = request;
    const files: string[] = [];
    const blocks: Prompt['blocks'] = [];
    const images: Prompt['images'] = [];
    for (const image of request.images) {
      const data = Buffer.from(image.dataUrl.slice(image.dataUrl.indexOf(',') + 1), 'base64');
      await this.store.writeExport(record.id, image.name, data);
      files.push(image.name);
      if (SHEETS.includes(image.name)) {
        await this.store.saveMedia(record.id, image.name, data);
        images.push({ src: `/api/jobs/${record.id}/media/${image.name}`, alt: image.name });
        blocks.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: data.toString('base64') },
        });
      }
    }
    const clip =
      include.motion && sketch.motion.keys.length
        ? clipSource(sketch.motion.keys, sketch.motion.hitFrame)
        : null;
    if (clip) {
      await this.store.writeExport(record.id, 'motion-clip.ts', `${clip}\n`);
      files.push('motion-clip.ts');
    }
    if (include.effect) {
      const cels = [...sketch.effect.cels]
        .sort((a, b) => a.frame - b.frame)
        .map((cel) => ({ frame: cel.frame, hold: cel.hold, ...celRows(cel) }));
      await this.store.writeExport(record.id, 'effect.json', JSON.stringify({ cels }, null, 2));
      files.push('effect.json');
    }
    await this.store.writeExport(record.id, 'sketch.json', JSON.stringify(sketch, null, 2));
    files.push('sketch.json');
    const brief = buildBrief({
      request,
      cwd: record.cwd,
      branch: record.branch,
      target: record.target,
      exportsDir: this.store.exportsDir(record.id),
      files,
      clip,
      hitFrame: sketch.motion.hitFrame,
    });
    record.brief = brief;
    await this.store.writeExport(record.id, 'brief.md', brief);
    return {
      text: brief,
      blocks,
      images,
      model: record.model,
      permissionMode: record.permissionMode,
    };
  }

  private assertCapacity(): void {
    const active = [...this.jobs.values()].filter((job) => job.run).length;
    if (active >= MAX_ACTIVE_RUNS) {
      throw new StudioError(409, `At most ${MAX_ACTIVE_RUNS} agents run at once. Stop one first.`);
    }
  }

  /** Starts the job's agent when none is running, then sends the turn. */
  private async send(job: Job, prompt: Prompt): Promise<void> {
    const { record } = job;
    if (!job.run) {
      this.assertCapacity();
      const run = new AgentRun(
        this.runtime,
        {
          sessionId: record.sessionId,
          resume: record.started,
          cwd: record.cwd,
          model: prompt.model,
          permissionMode: prompt.permissionMode,
        },
        job.timeline,
        job.channel,
        () => void this.store.saveTimeline(record.id, job.timeline.list()),
        (closed) => {
          if (job.run === closed) {
            job.run = null;
          }
          void this.store.saveTimeline(record.id, job.timeline.list());
        },
      );
      job.run = run;
      run.launch();
    }
    await job.run.send(prompt);
    if (!record.started || record.model !== prompt.model) {
      record.started = true;
      record.model = prompt.model;
      record.permissionMode = prompt.permissionMode;
      await this.store.saveRecord(record);
    }
  }

  async turn(id: string, request: TurnRequest): Promise<void> {
    const job = this.job(id);
    if (!job.record.brief) {
      throw new StudioError(409, 'The job is still setting up.');
    }
    await this.send(job, { ...request, blocks: [], images: [] });
  }

  async mode(id: string, mode: PermissionModeId): Promise<void> {
    const job = this.job(id);
    job.record.permissionMode = mode;
    await job.run?.setPermissionMode(mode);
    await this.store.saveRecord(job.record);
  }

  decide(id: string, approvalId: string, request: DecisionRequest): void {
    const run = this.job(id).run;
    if (!run?.decide(approvalId, request.decision, request.answers)) {
      throw new StudioError(409, 'That request is no longer waiting.');
    }
  }

  async stop(id: string): Promise<void> {
    await this.job(id).run?.stop();
  }

  /** Runs the game from the job's folder so the owner can play the result. */
  async startPreview(id: string): Promise<PreviewState> {
    const job = this.job(id);
    if (job.preview && job.preview.state.status !== 'failed') {
      return job.preview.state;
    }
    const preview = new Preview(job.record.cwd, (state) =>
      job.channel.publish({ type: 'preview', preview: state }),
    );
    job.preview = preview;
    job.channel.publish({ type: 'preview', preview: preview.state });
    await preview.start();
    return preview.state;
  }

  stopPreview(id: string): void {
    const job = this.job(id);
    job.preview?.stop();
    job.preview = null;
    job.channel.publish({ type: 'preview', preview: null });
  }

  /** Ends every agent and preview, for a server shutdown. */
  closeAll(): void {
    for (const job of this.jobs.values()) {
      job.run?.close();
      job.preview?.stop();
    }
  }
}
