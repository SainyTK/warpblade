import type { Pose } from '@game/types/pose';
import type { MotionKey } from '@shared/sketch';
import { useEditorStore } from '@/store/editorStore';
import { useMotionKeys } from '@/store/sketchStore';
import { keyAt, poseAt, rootAt } from '@/utils/frames';
import { useToolFrame } from './useToolFrame';

export interface CurrentPose {
  pose: Pose;
  root: { x: number; y: number };
  /** The snapshot at the playhead, which edits change directly. */
  key: MotionKey | null;
  /** True when the pose is a draft that a snapshot would keep. */
  draft: boolean;
}

/** The pose at the tool frame (the playhead, held while playing): its snapshot, the draft being made there, or the in-between the game would show. */
export function useCurrentPose(): CurrentPose {
  const keys = useMotionKeys();
  const frame = useToolFrame();
  const draft = useEditorStore((state) => state.draft);
  const key = keyAt(keys, frame) ?? null;
  if (key) {
    return { pose: key.pose, root: key.root, key, draft: false };
  }
  if (draft && draft.frame === frame) {
    return { pose: draft.pose, root: draft.root, key: null, draft: true };
  }
  return { pose: poseAt(keys, frame), root: rootAt(keys, frame), key: null, draft: false };
}
