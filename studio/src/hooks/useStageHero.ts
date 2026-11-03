import { useMemo } from 'react';
import { useSketchStore } from '@/store/sketchStore';
import { motionFrames } from '@/utils/motionFrames';
import { type HeroLayer, stillHero } from '@/utils/stageRaster';
import { useCurrentPose } from './useCurrentPose';
import { useLastFrame } from './useTimelineLength';

/** Kael on the stage: a draft stands still, every other frame swings the scarf as the motion plays. */
export function useStageHero(frame: number): HeroLayer {
  const keys = useSketchStore((state) => state.sketch?.motion.keys);
  const last = useLastFrame();
  const current = useCurrentPose();
  const frames = useMemo(() => motionFrames(keys ?? [], last), [keys, last]);
  const draftHero = useMemo(
    () => (current.draft ? stillHero(current.pose, current.root) : null),
    [current.draft, current.pose, current.root],
  );
  return draftHero ?? frames[frame] ?? stillHero(current.pose, current.root);
}
