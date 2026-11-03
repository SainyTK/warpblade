import type { ApprovalDecision, JobView } from '@shared/api';
import type { PermissionModeId } from '@shared/permissionModes';
import { createContext } from 'react';

export interface ActiveJob {
  view: JobView | null;
  error: string | null;
  /** The agent is starting, working or waiting for an answer. */
  busy: boolean;
  decide: (
    approvalId: string,
    decision: ApprovalDecision,
    answers?: Record<string, string>,
  ) => Promise<void>;
  send: (text: string, model: string, permissionMode: PermissionModeId) => Promise<void>;
  stop: () => Promise<void>;
  setMode: (permissionMode: PermissionModeId) => Promise<void>;
}

export const ActiveJobContext = createContext<ActiveJob | null>(null);
