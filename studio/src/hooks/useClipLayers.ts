import { useMemo } from 'react';
import { useOpenHero } from '@/hooks/useOpenHero';
import { useMotionStore } from '@/store/motionStore';
import type { HeroLayer } from '@/types/studio';
import { motionFrames } from '@/utils/motionFrames';

/** The open hero at every frame of the open clip, the scarf and ponytail swinging through it. */
export function useClipLayers(): HeroLayer[] {
  const { skin } = useOpenHero();
  const frames = useMotionStore((state) => state.current.frames);
  return useMemo(() => motionFrames(skin, frames), [skin, frames]);
}
