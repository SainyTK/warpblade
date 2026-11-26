import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A tiny tag on a frame card: the hit frame or a snap. */
export function MarkBadge({ tone, children }: { tone: 'snap' | 'hit'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'rounded-[3px] px-1 text-[10px] leading-4',
        tone === 'snap' && 'bg-primary/20 text-primary',
        tone === 'hit' && 'bg-destructive/20 text-destructive',
      )}
    >
      {children}
    </span>
  );
}
