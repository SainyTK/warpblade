import { ActiveJobProvider } from '@/providers/ActiveJobProvider';
import { AgentTimeline } from './AgentTimeline';
import { JobComposer } from './JobComposer';
import { JobHeader } from './JobHeader';

/** One job: its header, the agent's live timeline and the composer for follow-ups. */
export function JobPanel({ jobId }: { jobId: string }) {
  return (
    <ActiveJobProvider jobId={jobId}>
      <div className="flex h-full min-h-0 flex-col">
        <JobHeader />
        <AgentTimeline />
        <JobComposer />
      </div>
    </ActiveJobProvider>
  );
}
