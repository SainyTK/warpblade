import { ArrowLeft, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { useEditorStore } from '@/store/editorStore';
import { AgentStatusBadge } from './AgentStatusBadge';
import { JobPreview } from './JobPreview';

/** The open job: back to the list, its title, where it works and the game preview. */
export function JobHeader() {
  const { view } = useActiveJob();
  const set = useEditorStore((state) => state.set);
  return (
    <header className="grid gap-2 border-border border-b px-3 py-2">
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="All jobs"
          onClick={() => set({ jobId: null })}
        >
          <ArrowLeft />
        </Button>
        <h2 className="line-clamp-2 min-w-0 flex-1 pt-1 text-sm">{view?.title ?? 'Loading'}</h2>
        {view?.run && <AgentStatusBadge status={view.run.status} />}
      </div>
      {view && (
        <p
          className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground"
          title={view.workdir}
        >
          <FolderGit2 className="size-3.5 shrink-0" />
          <span className="truncate">
            {view.branch ? `${view.branch} in ${view.workdir}` : view.workdir}
          </span>
        </p>
      )}
      <JobPreview />
    </header>
  );
}
