import { useTimelineLength } from '@/hooks/useTimelineLength';
import { useTrackDrag } from '@/hooks/useTrackDrag';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { CelMarker } from './CelMarker';
import { KeyMarker } from './KeyMarker';

const FRAME_PX = 18;
const LABEL_EVERY = 5;
const ROWS = [
  { id: 'motion', label: 'Motion' },
  { id: 'effect', label: 'Effect' },
] as const;

/** Frames at 30 a second: the ruler, the snapshots and the drawn frames. Click or drag to move the playhead. */
export function FrameTrack() {
  const sketch = useSketchStore((state) => state.sketch);
  const frame = useEditorStore((state) => state.frame);
  const seek = useEditorStore((state) => state.seek);
  const length = useTimelineLength();
  const scrub = useTrackDrag(FRAME_PX, seek);
  if (!sketch) {
    return null;
  }
  const hit = sketch.motion.hitFrame;
  return (
    <div className="flex min-w-0 border-border border-t">
      <div className="grid shrink-0 grid-rows-[18px_26px_26px] border-border border-r text-[11px] text-muted-foreground">
        <span />
        {ROWS.map((row) => (
          <span key={row.id} className="flex items-center px-3">
            {row.label}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div
          data-track
          {...scrub}
          className="relative grid cursor-pointer touch-none select-none grid-rows-[18px_26px_26px]"
          style={{ width: length * FRAME_PX }}
        >
          <div className="relative border-border border-b">
            {Array.from({ length }, (_, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: one tick per frame number.
                key={index}
                className="absolute top-0 h-full border-border/60 border-l"
                style={{
                  left: index * FRAME_PX,
                  height: index % LABEL_EVERY === 0 ? '100%' : '30%',
                }}
              >
                {index % LABEL_EVERY === 0 && (
                  <span className="absolute top-0.5 left-1 text-[10px] text-muted-foreground tabular-nums">
                    {index}
                  </span>
                )}
              </span>
            ))}
            {hit !== null && (
              <span
                role="img"
                aria-label={`Hit at frame ${hit}`}
                className="absolute bottom-0 h-0 w-0 -translate-x-1/2 border-x-[5px] border-x-transparent border-b-[7px] border-b-destructive"
                style={{ left: (hit + 0.5) * FRAME_PX }}
              />
            )}
          </div>
          <div className="relative border-border/60 border-b">
            {sketch.motion.keys.map((key) => (
              <KeyMarker key={key.id} motionKey={key} framePx={FRAME_PX} />
            ))}
          </div>
          <div className="relative">
            {sketch.effect.cels.map((cel) => (
              <CelMarker key={cel.id} cel={cel} framePx={FRAME_PX} />
            ))}
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-warning"
            style={{ left: (frame + 0.5) * FRAME_PX }}
          />
        </div>
      </div>
    </div>
  );
}
