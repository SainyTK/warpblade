import type { RunStatus } from '@shared/api';
import { LoaderCircle } from 'lucide-react';

const LABEL: Partial<Record<RunStatus, string>> = {
  starting: 'Starting Claude Code',
  running: 'Working',
  waiting: 'Waiting for your answer',
};

/** The line under the newest item while the agent works. */
export function AgentWorking({ status }: { status: RunStatus }) {
  const label = LABEL[status];
  if (!label) {
    return null;
  }
  return (
    <p className="flex items-center gap-2 text-[13px] text-muted-foreground" role="status">
      {status !== 'waiting' && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
      {label}
    </p>
  );
}
