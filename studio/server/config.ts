import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVER_PORT, UI_PORT } from '../shared/ports';
import type { StudioConfig } from './types/config';

const studioRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** The git user name as a branch prefix, matching the owner's `SainyTK/...` branches. */
function branchPrefix(repoRoot: string): string {
  try {
    const name = execFileSync('git', ['config', 'user.name'], { cwd: repoRoot, encoding: 'utf8' });
    return name.trim() ? `${name.trim()}/` : '';
  } catch {
    return '';
  }
}

/** The studio's settings from its environment. Defaults match the Mac's cld proxy setup. */
export function configuration(env = process.env): StudioConfig {
  const home = homedir();
  const repoRoot = resolve(studioRoot, '..');
  return {
    port: Number(env.STUDIO_PORT ?? SERVER_PORT),
    origins: [`http://127.0.0.1:${UI_PORT}`, `http://localhost:${UI_PORT}`],
    repoRoot,
    dataDir: resolve(env.STUDIO_DATA_DIR ?? join(studioRoot, '.data')),
    worktreeRoot: resolve(env.STUDIO_WORKTREE_ROOT ?? join(home, 'orca/workspaces/warpblade')),
    branchPrefix: env.STUDIO_BRANCH_PREFIX ?? branchPrefix(repoRoot),
    baseBranch: env.STUDIO_BASE_BRANCH ?? 'main',
    proxyUrl: env.STUDIO_PROXY_URL ?? 'http://127.0.0.1:8317',
    proxyKeyFile: env.STUDIO_PROXY_KEY_FILE ?? join(home, '.config/cliproxyapi/client-key'),
    claudePath: env.STUDIO_CLAUDE_PATH ?? join(home, '.local/bin/claude'),
    claudeConfigDir: env.CLAUDE_CONFIG_DIR ?? join(home, '.claude'),
    defaultModel: env.STUDIO_DEFAULT_MODEL ?? null,
  };
}
