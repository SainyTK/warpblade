import type { MotionKey } from '@shared/sketch';
import { useTrackDrag } from '@/hooks/useTrackDrag';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { moveKey } from '@/utils/sketchEdits';

/** A snapshot on the track. Click to go to it, drag to retime it. */
export function KeyMarker({ motionKey, framePx }: { motionKey: MotionKey; framePx: number }) {
  const change = useSketchStore((state) => state.change);
  const checkpoint = useSketchStore((state) => state.checkpoint);
  const seek = useEditorStore((state) => state.seek);
  const active = useEditorStore((state) => state.frame === motionKey.frame);
  const drag = useTrackDrag(
    framePx,
    (frame, moved) => {
      if (moved) {
        change((sketch) => moveKey(sketch, motionKey.id, frame), false);
      }
      seek(moved ? frame : motionKey.frame);
    },
    checkpoint,
  );
  return (
    <button
      type="button"
      aria-label={`Snapshot at frame ${motionKey.frame}`}
      {...drag}
      className="absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center"
      style={{ left: (motionKey.frame + 0.5) * framePx }}
    >
      <span
        className={cn(
          'size-2.5 rotate-45 border border-background',
          motionKey.snap ? 'bg-primary' : 'bg-foreground',
          active && 'ring-2 ring-warning',
        )}
      />
    </button>
  );
}
