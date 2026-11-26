import type { Pose } from '@game/types/pose';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { setFrame } from '@/utils/clipEdits';

/** The pose at the playhead and the edits to it. */
export function usePoseEditor() {
  const frame = useEditorStore((state) => state.frame);
  const pose = useMotionStore(
    (state) => state.current.frames[frame] ?? state.current.frames.at(-1),
  );
  const change = useMotionStore((state) => state.change);
  const checkpoint = useMotionStore((state) => state.checkpoint);
  if (!pose) {
    throw new Error('The open clip has no frames.');
  }
  /** Sets the pose; `record` false joins the change to the gesture's undo step. */
  const setPose = (next: Pose, record = true) =>
    change((clip) => setFrame(clip, frame, next), record);
  return { frame, pose, setPose, beginGesture: checkpoint };
}
