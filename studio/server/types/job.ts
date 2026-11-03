import type { JobTarget } from '../../shared/api';
import type { PermissionModeId } from '../../shared/permissionModes';

/** What the server keeps about a job in its job.json. */
export interface JobRecord {
  id: string;
  title: string;
  createdAt: string;
  sketchId: string;
  sketchName: string;
  target: JobTarget;
  branch: string | null;
  cwd: string;
  /** The Claude Code session the agent writes to; follow-ups resume it. */
  sessionId: string;
  /** False until the first turn has started, so the first run creates the session and later runs resume it. */
  started: boolean;
  model: string;
  permissionMode: PermissionModeId;
  brief: string;
}
