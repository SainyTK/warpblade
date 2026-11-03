import type { EffectCel } from '@shared/sketch';
import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { poseAt, rootAt } from '@/utils/frames';
import { thumbnail } from '@/utils/thumbnail';
import { FrameCard } from './FrameCard';

/** One effect frame in the filmstrip, over a faint Kael at that frame. */
export function CelCard({ cel }: { cel: EffectCel }) {
  const active = useEditorStore(
    (state) => state.frame >= cel.frame && state.frame < cel.frame + cel.hold,
  );
  const seek = useEditorStore((state) => state.seek);
  const keys = useSketchStore((state) => state.sketch?.motion.keys);
  const raster = useMemo(() => {
    const hero = keys?.length
      ? { pose: poseAt(keys, cel.frame), root: rootAt(keys, cel.frame) }
      : null;
    return thumbnail(hero, cel.pixels, 0.4);
  }, [cel, keys]);
  return (
    <FrameCard
      raster={raster}
      label={`${cel.frame} +${cel.hold}`}
      active={active}
      onSelect={() => seek(cel.frame)}
    />
  );
}
