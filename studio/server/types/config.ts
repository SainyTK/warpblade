export interface StudioConfig {
  port: number;
  /** Page origins allowed to send writes. */
  origins: string[];
  /** The Warpblade repository the studio belongs to. */
  repoRoot: string;
  /** The studio folder, where the drafts are kept. */
  studioRoot: string;
}
