import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A tiny tag on a frame card: a snap key or the hit frame. */
export function MarkBadge({
  tone,
  children,
}: {
  tone: 'snap' | 'hit' | 'draft';
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'rounded-[3px] px-1 text-[10px] leading-4',
        tone === 'snap' && 'bg-primary/20 text-primary',
        tone === 'hit' && 'bg-destructive/20 text-destructive',
        tone === 'draft' && 'bg-warning/20 text-warning',
      )}
    >
      {children}
    </span>
  );
}
