import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { StudioConfig } from '../types/config';
import { StudioError } from '../utils/errors';
import { run } from './processes';

export interface Worktree {
  cwd: string;
  branch: string;
}

/** A fresh git worktree per job, beside the owner's other Warpblade worktrees, with its dependencies installed. */
export class WorktreeService {
  constructor(private readonly config: StudioConfig) {}

  async create(slug: string): Promise<Worktree> {
    const branch = `${this.config.branchPrefix}studio-${slug}`;
    const cwd = join(this.config.worktreeRoot, `studio-${slug}`);
    if (existsSync(cwd)) {
      throw new StudioError(409, `The folder ${cwd} already exists.`);
    }
    await mkdir(this.config.worktreeRoot, { recursive: true });
    await run(
      'git',
      ['worktree', 'add', '-b', branch, cwd, this.config.baseBranch],
      this.config.repoRoot,
    );
    await run('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], cwd);
    // SuperU context (tasks, preferences, skills) for the agent, as the owner's Orca worktrees get it.
    await run('supu', ['activate', cwd], cwd).catch(() => undefined);
    return { cwd, branch };
  }

  /** The branch the repo's own checkout is on, for jobs that work there. */
  async checkoutBranch(): Promise<string | null> {
    try {
      const name = await run('git', ['branch', '--show-current'], this.config.repoRoot);
      return name.trim() || null;
    } catch {
      return null;
    }
  }
}
