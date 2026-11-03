import type { MotionKey } from '@shared/sketch';
import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { thumbnail } from '@/utils/thumbnail';
import { FrameCard } from './FrameCard';
import { MarkBadge } from './MarkBadge';

/** One snapshot in the filmstrip. */
export function KeyCard({ motionKey }: { motionKey: MotionKey }) {
  const active = useEditorStore((state) => state.frame === motionKey.frame);
  const seek = useEditorStore((state) => state.seek);
  const hit = useSketchStore((state) => state.sketch?.motion.hitFrame === motionKey.frame);
  const raster = useMemo(() => thumbnail(motionKey, null), [motionKey]);
  return (
    <FrameCard
      raster={raster}
      label={String(motionKey.frame)}
      active={active}
      onSelect={() => seek(motionKey.frame)}
      badges={
        <>
          {motionKey.snap && <MarkBadge tone="snap">snap</MarkBadge>}
          {hit && <MarkBadge tone="hit">hit</MarkBadge>}
        </>
      }
    />
  );
}
