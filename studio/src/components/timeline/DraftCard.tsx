import { useMemo } from 'react';
import type { Draft } from '@/store/editorStore';
import { thumbnail } from '@/utils/thumbnail';
import { FrameCard } from './FrameCard';
import { MarkBadge } from './MarkBadge';

/** The pose being made at the playhead, before its snapshot is taken. */
export function DraftCard({ draft }: { draft: Draft }) {
  const raster = useMemo(() => thumbnail(draft, null), [draft]);
  return (
    <FrameCard
      raster={raster}
      label={String(draft.frame)}
      active
      dashed
      onSelect={() => {}}
      badges={<MarkBadge tone="draft">draft</MarkBadge>}
    />
  );
}
