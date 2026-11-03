// Server-side settings. Everything that decides where agents run or which proxy they use lives here, never in a request.
export interface StudioConfig {
  port: number;
  /** Page origins allowed to send writes. */
  origins: string[];
  /** The Warpblade repository the studio belongs to. */
  repoRoot: string;
  /** Sketches, jobs and their exports. */
  dataDir: string;
  /** Parent folder for job worktrees, beside the owner's other Warpblade worktrees. */
  worktreeRoot: string;
  /** Branches for job worktrees are named `<branchPrefix>studio-<slug>`. */
  branchPrefix: string;
  /** The branch new worktrees start from. */
  baseBranch: string;
  proxyUrl: string;
  proxyKeyFile: string;
  claudePath: string;
  claudeConfigDir: string;
  defaultModel: string | null;
}
