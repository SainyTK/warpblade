import type { RunStatus } from '@shared/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const LABEL: Record<RunStatus, string> = {
  starting: 'Starting',
  running: 'Working',
  waiting: 'Needs you',
  idle: 'Ready',
};

/** Whether this chat's agent is running. Only an open agent process has a status. */
export function AgentStatusBadge({ status }: { status: RunStatus }) {
  return (
    <Badge className={cn('shrink-0', status === 'waiting' && 'bg-warning-surface text-warning')}>
      {LABEL[status]}
    </Badge>
  );
}
