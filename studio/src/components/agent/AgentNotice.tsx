import type { NoticeItem } from '@shared/api';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A short line from the server, such as Stopped, a retry or an error. Errors use the destructive color and an icon. */
export function AgentNotice({ item }: { item: NoticeItem }) {
  const error = item.tone === 'error';
  return (
    <p
      role={error ? 'alert' : undefined}
      className={cn(
        'flex items-center justify-center gap-1.5 text-center text-[13px]',
        error ? 'text-destructive' : 'text-muted-foreground',
      )}
    >
      {error && <CircleAlert aria-hidden className="size-4 shrink-0" />}
      {item.text}
    </p>
  );
}
