import type { EffectCel } from '@shared/sketch';
import { useTrackDrag } from '@/hooks/useTrackDrag';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { moveCel } from '@/utils/sketchEdits';

/** A drawn frame on the track, as long as it holds. Click to go to it, drag to retime it. */
export function CelMarker({ cel, framePx }: { cel: EffectCel; framePx: number }) {
  const change = useSketchStore((state) => state.change);
  const checkpoint = useSketchStore((state) => state.checkpoint);
  const seek = useEditorStore((state) => state.seek);
  const active = useEditorStore(
    (state) => state.frame >= cel.frame && state.frame < cel.frame + cel.hold,
  );
  const drag = useTrackDrag(
    framePx,
    (frame, moved) => {
      if (moved) {
        change((sketch) => moveCel(sketch, cel.id, frame), false);
      }
      seek(moved ? frame : cel.frame);
    },
    checkpoint,
  );
  return (
    <button
      type="button"
      aria-label={`Effect frame at ${cel.frame}`}
      {...drag}
      className={cn(
        'absolute top-1 bottom-1 cursor-ew-resize touch-none rounded-[3px] border border-background bg-[#b673e8]/70',
        active && 'bg-[#b673e8] ring-2 ring-warning',
      )}
      style={{ left: cel.frame * framePx + 1, width: cel.hold * framePx - 2 }}
    />
  );
}
