import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Raster } from '@/types/studio';
import { THUMB_SCALE } from '@/utils/thumbnail';
import { RasterCanvas } from '../common/RasterCanvas';

interface FrameCardProps {
  raster: Raster;
  label: string;
  active: boolean;
  dashed?: boolean;
  badges?: ReactNode;
  onSelect: () => void;
}

/** A thumbnail in the filmstrip: the frame's picture and its frame number. */
export function FrameCard({
  raster,
  label,
  active,
  dashed = false,
  badges,
  onSelect,
}: FrameCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 flex-col items-stretch gap-1 rounded-md border border-border bg-card p-1 text-left hover:border-border-strong',
        active && 'border-primary ring-1 ring-primary',
        dashed && 'border-dashed',
      )}
    >
      <RasterCanvas raster={raster} scale={THUMB_SCALE} className="rounded-sm" />
      <span className="flex items-center justify-between gap-1 px-0.5 text-[11px] tabular-nums">
        {label}
        <span className="flex gap-0.5">{badges}</span>
      </span>
    </button>
  );
}
