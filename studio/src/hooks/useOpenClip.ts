import type { MotionId } from '@shared/motionId';
import { useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';

/** Opens a hero's clip on the stage at its first frame. */
export function useOpenClip(): (motion: MotionId) => void {
  const open = useMotionStore((state) => state.open);
  const seek = useEditorStore((state) => state.seek);
  return useCallback(
    (motion) => {
      open(motion);
      seek(0);
    },
    [open, seek],
  );
}
