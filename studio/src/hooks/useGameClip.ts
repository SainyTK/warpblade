import type { MotionId } from '@shared/motionId';
import { useMotionStore } from '@/store/motionStore';
import type { ClipFrames } from '@/types/studio';

/** The clip as the game plays it now. */
export const useGameClip = (motion: MotionId): ClipFrames =>
  useMotionStore((state) => state.game[motion]);
