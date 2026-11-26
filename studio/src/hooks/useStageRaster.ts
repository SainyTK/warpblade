import { useMemo } from 'react';
import { ONION } from '@/constants/stage';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import type { Raster } from '@/types/studio';
import { stageRaster } from '@/utils/stageRaster';
import { useClipLayers } from './useClipLayers';
import { useOpenHero } from './useOpenHero';

/** The stage picture at the playhead, with the frames before and after as onion skins while paused. */
export function useStageRaster(): Raster {
  const frames = useMotionStore((state) => state.current.frames);
  const { frame, onion, grid, playing } = useEditorStore();
  const layers = useClipLayers();
  const { skin } = useOpenHero();
  return useMemo(() => {
    const before = frames[frame - 1];
    const after = frames[frame + 1];
    const onions =
      onion && !playing
        ? [
            ...(before ? [{ pose: before, tint: ONION.before }] : []),
            ...(after ? [{ pose: after, tint: ONION.after }] : []),
          ]
        : [];
    return stageRaster({ skin, hero: layers[frame] ?? layers.at(-1) ?? null, onions, grid });
  }, [skin, frames, frame, onion, grid, playing, layers]);
}
