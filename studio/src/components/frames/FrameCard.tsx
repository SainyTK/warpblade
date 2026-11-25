import type { Pose } from '@game/types/pose';
import { memo, useEffect, useRef } from 'react';
import { THUMB } from '@/constants/stage';
import { useOpenHero } from '@/hooks/useOpenHero';
import { useOpenMotion } from '@/hooks/useOpenMotion';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { hitFrame } from '@/utils/clipTiming';
import { frameThumbnail } from '@/utils/frameThumbnail';
import { RasterCanvas } from '../common/RasterCanvas';
import { MarkBadge } from './MarkBadge';

/** One frame of the open clip: its picture, its number and its marks. Click to pose it. */
export const FrameCard = memo(function FrameCard({ index, pose }: { index: number; pose: Pose }) {
  const active = useEditorStore((state) => state.frame === index);
  const seek = useEditorStore((state) => state.seek);
  const snap = useMotionStore((state) => state.current.snaps.includes(index));
  const count = useMotionStore((state) => state.current.frames.length);
  const hit = hitFrame(useOpenMotion(), count) === index;
  const raster = frameThumbnail(useOpenHero().skin, pose);
  const card = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active) {
      card.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [active]);
  return (
    <button
      ref={card}
      type="button"
      onClick={() => seek(index)}
      aria-pressed={active}
      aria-label={`Frame ${index}`}
      className={cn(
        'flex shrink-0 flex-col gap-1 rounded-md border border-border bg-background p-1 text-left hover:border-border-strong',
        active && 'border-primary ring-1 ring-primary',
      )}
    >
      <RasterCanvas raster={raster} scale={THUMB.scale} className="rounded-sm" />
      <span className="flex items-center justify-between gap-1 px-0.5 text-[11px] tabular-nums">
        {index}
        <span className="flex gap-0.5">
          {snap && <MarkBadge tone="snap">snap</MarkBadge>}
          {hit && <MarkBadge tone="hit">hit</MarkBadge>}
        </span>
      </span>
    </button>
  );
});
