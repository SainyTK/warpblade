import { useMemo } from 'react';
import { ONION } from '@/constants/stage';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import type { Raster } from '@/types/studio';
import { celAt, neighbours } from '@/utils/frames';
import { stageRaster } from '@/utils/stageRaster';
import { useStageHero } from './useStageHero';

/** The stage picture at the playhead for the current mode. */
export function useStageRaster(): Raster {
  const sketch = useSketchStore((state) => state.sketch);
  const { mode, frame, onion, grid, underlay, playing } = useEditorStore();
  const hero = useStageHero(frame);
  return useMemo(() => {
    const keys = sketch?.motion.keys ?? [];
    const cels = sketch?.effect.cels ?? [];
    const cel = celAt(cels, frame);
    const showOnion = onion && !playing;
    if (mode === 'motion') {
      const { before, after } = neighbours(keys, frame);
      return stageRaster({
        hero,
        heroAlpha: 1,
        onions: showOnion
          ? [
              ...(before ? [{ pose: before.pose, root: before.root, tint: ONION.before }] : []),
              ...(after ? [{ pose: after.pose, root: after.root, tint: ONION.after }] : []),
            ]
          : [],
        pixels: cel?.pixels ?? null,
        pixelOnions: [],
        grid,
        background: true,
      });
    }
    const previous = neighbours(cels, cel?.frame ?? frame).before;
    return stageRaster({
      hero: underlay ? hero : null,
      heroAlpha: 0.4,
      onions: [],
      pixels: cel?.pixels ?? null,
      pixelOnions: showOnion && previous ? [{ pixels: previous.pixels, tint: ONION.before }] : [],
      grid,
      background: true,
    });
  }, [sketch, mode, frame, onion, grid, underlay, playing, hero]);
}
