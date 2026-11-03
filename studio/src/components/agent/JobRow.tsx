import type { JobSummary } from '@shared/api';
import { GitBranch } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { shortTime } from '@/utils/time';
import { AgentStatusBadge } from './AgentStatusBadge';

/** One job in the list: what was asked, from which sketch, where it works and whether its agent runs. */
export function JobRow({ job }: { job: JobSummary }) {
  const set = useEditorStore((state) => state.set);
  return (
    <button
      type="button"
      onClick={() => set({ jobId: job.id })}
      className="grid w-full gap-1 rounded-md border border-border bg-card px-3 py-2 text-left hover:border-border-strong"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-sm">{job.title}</span>
        {job.run && <AgentStatusBadge status={job.run.status} />}
      </span>
      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">{job.sketchName}</span>
        <span>{shortTime(job.createdAt)}</span>
      </span>
      {job.branch && (
        <span className="flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
          <GitBranch className="size-3 shrink-0" />
          <span className="truncate">{job.branch}</span>
        </span>
      )}
    </button>
  );
}
