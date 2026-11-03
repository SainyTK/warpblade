import type { Pose } from '@game/types/pose';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { keyAt } from '@/utils/frames';
import { putKey, updateKey } from '@/utils/sketchEdits';
import { useCurrentPose } from './useCurrentPose';
import { useToolFrame } from './useToolFrame';

type Root = { x: number; y: number };

/**
 * Changes the pose at the playhead. A snapshot there is edited in place; elsewhere the change becomes a draft
 * until the owner takes a snapshot.
 */
export function usePoseEditor() {
  const current = useCurrentPose();
  const change = useSketchStore((state) => state.change);
  const checkpoint = useSketchStore((state) => state.checkpoint);
  const frame = useToolFrame();
  const gap = useEditorStore((state) => state.snapshotGap);
  const set = useEditorStore((state) => state.set);

  /** Sets the pose; `record` false joins the change to the gesture's undo step. */
  const setPose = (pose: Pose, root: Root = current.root, record = true) => {
    if (current.key) {
      const id = current.key.id;
      change((sketch) => updateKey(sketch, id, { pose, root }), record);
    } else {
      set({ draft: { frame, pose, root } });
    }
  };

  /** Keeps the pose as a snapshot here, then moves on with a copy to pose the next one. */
  const takeSnapshot = () => {
    const { pose, root } = current;
    change((sketch) => putKey(sketch, frame, pose, root));
    const next = frame + gap;
    const sketch = useSketchStore.getState().sketch;
    const occupied = sketch ? keyAt(sketch.motion.keys, next) : undefined;
    set({ frame: next, draft: occupied ? null : { frame: next, pose, root } });
  };

  return { ...current, setPose, takeSnapshot, beginGesture: () => current.key && checkpoint() };
}
