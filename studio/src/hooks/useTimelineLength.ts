import { TIMELINE_TAIL } from '@/constants/stage';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { lastCelFrame, lastKeyFrame } from '@/utils/frames';

/** The last frame of the sketch (its motion or its effect, whichever runs longer). */
export function useLastFrame(): number {
  return useSketchStore((state) =>
    state.sketch
      ? Math.max(lastKeyFrame(state.sketch.motion.keys), lastCelFrame(state.sketch.effect.cels))
      : 0,
  );
}

/** Frames the timeline shows: the sketch, the playhead and room to add more. */
export function useTimelineLength(): number {
  const last = useLastFrame();
  const frame = useEditorStore((state) => state.frame);
  return Math.max(last, frame) + TIMELINE_TAIL;
}
