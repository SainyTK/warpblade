import { useJobs } from '@/hooks/useJobs';
import { useEditorStore } from '@/store/editorStore';
import { BuildDialog } from './BuildDialog';
import { JobList } from './JobList';
import { JobPanel } from './JobPanel';

/** The agents beside the stage: build the sketch with a new agent, or follow a job. */
export function AgentPanel() {
  const jobId = useEditorStore((state) => state.jobId);
  const { jobs, refresh } = useJobs();
  if (jobId) {
    return <JobPanel jobId={jobId} />;
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-border border-b p-3">
        <BuildDialog onCreated={refresh} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <JobList jobs={jobs} />
      </div>
    </div>
  );
}
