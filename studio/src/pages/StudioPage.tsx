import { AgentPanel } from '@/components/agent/AgentPanel';
import { ToolPanel } from '@/components/common/ToolPanel';
import { StudioHeader } from '@/components/header/StudioHeader';
import { Stage } from '@/components/stage/Stage';
import { Timeline } from '@/components/timeline/Timeline';
import { usePlayback } from '@/hooks/usePlayback';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useSketchLibrary } from '@/hooks/useSketchLibrary';
import { useSketchStore } from '@/store/sketchStore';

/** The studio: tools on the left, the stage and timeline in the middle, agents on the right. */
export function StudioPage() {
  const { error } = useSketchLibrary();
  const ready = useSketchStore((state) => state.sketch !== null);
  usePlayback();
  useShortcuts();
  if (!ready) {
    return (
      <main className="grid h-full place-items-center text-muted-foreground">
        {error ?? 'Opening the studio'}
      </main>
    );
  }
  return (
    <div className="flex compact:h-auto h-full flex-col">
      <StudioHeader />
      <div className="compact:flex grid min-h-0 flex-1 grid-cols-[272px_minmax(0,1fr)_380px] compact:flex-col">
        <aside className="compact:order-2 min-h-0 compact:overflow-visible overflow-y-auto border-border compact:border-t border-r compact:border-r-0 bg-card">
          <ToolPanel />
        </aside>
        <main className="compact:order-1 flex min-h-0 min-w-0 flex-col">
          <div className="flex compact:h-[300px] min-h-0 compact:flex-none flex-1 p-3">
            <Stage />
          </div>
          <Timeline />
        </main>
        <aside className="compact:order-3 compact:h-[80vh] min-h-0 border-border compact:border-t border-l compact:border-l-0 bg-card">
          <AgentPanel />
        </aside>
      </div>
    </div>
  );
}
