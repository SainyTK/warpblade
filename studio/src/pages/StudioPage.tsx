import { FrameStrip } from '@/components/frames/FrameStrip';
import { Transport } from '@/components/frames/Transport';
import { MotionGallery } from '@/components/gallery/MotionGallery';
import { StudioHeader } from '@/components/header/StudioHeader';
import { FramePanel } from '@/components/panel/FramePanel';
import { Stage } from '@/components/stage/Stage';
import { useAutosave } from '@/hooks/useAutosave';
import { useDraftBoot } from '@/hooks/useDraftBoot';
import { useLiveMotion } from '@/hooks/useLiveMotion';
import { usePlayback } from '@/hooks/usePlayback';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useMotionStore } from '@/store/motionStore';

/** The studio: Kael's moves on the left, the stage and frames in the middle, the frame's pose on the right. */
export function StudioPage() {
  const error = useDraftBoot();
  const ready = useMotionStore((state) => state.ready);
  useAutosave();
  useLiveMotion();
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
      <div className="compact:flex grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_280px] compact:flex-col">
        <aside className="compact:order-1 min-h-0 compact:overflow-visible overflow-y-auto border-border border-r compact:border-r-0 compact:border-b bg-card">
          <MotionGallery />
        </aside>
        <main className="compact:order-2 flex min-h-0 min-w-0 flex-col">
          <div className="flex compact:h-[300px] min-h-0 compact:flex-none flex-1 p-3">
            <Stage />
          </div>
          <div className="shrink-0 border-border border-t bg-card">
            <Transport />
            <FrameStrip />
          </div>
        </main>
        <aside className="compact:order-3 min-h-0 compact:overflow-visible overflow-y-auto border-border compact:border-t border-l compact:border-l-0 bg-card">
          <FramePanel />
        </aside>
      </div>
    </div>
  );
}
