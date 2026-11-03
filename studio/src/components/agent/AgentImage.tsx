import type { ImageRef } from '@shared/api';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useMediaViewer } from '@/hooks/useMediaViewer';
import { cn } from '@/lib/utils';

interface AgentImageProps {
  image: ImageRef;
  /** A square thumbnail for attachments and tool output, or the image at its own size in a reply. */
  variant: 'thumbnail' | 'inline';
  /** A mentioned path that turns out not to be an image shows nothing. */
  hideOnError?: boolean;
}

/** An image that opens the full-size viewer, with a placeholder while it loads and a note when it cannot load. */
export function AgentImage({ image, variant, hideOnError = false }: AgentImageProps) {
  const { open } = useMediaViewer();
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  if (state === 'failed' && hideOnError) {
    return null;
  }
  if (state === 'failed') {
    return (
      <span
        role="img"
        aria-label={`${image.alt}: could not be loaded`}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-border border-dashed bg-muted px-3 py-2 align-middle text-[13px] text-muted-foreground',
          variant === 'thumbnail' &&
            'narrow:size-20 size-24 flex-col justify-center px-1 text-center text-[11px]',
        )}
      >
        <ImageOff aria-hidden className="size-4 shrink-0" />
        <span
          className={cn('min-w-0', variant === 'inline' ? 'truncate' : 'line-clamp-2 break-all')}
        >
          {variant === 'inline'
            ? `Image not available: ${image.alt || image.src}`
            : 'Not available'}
        </span>
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Open image: ${image.alt || 'image'}`}
      onClick={() => open(image)}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-muted align-middle',
        variant === 'thumbnail' ? 'block narrow:size-20 size-24' : 'my-2 inline-block max-w-full',
        state === 'loading' && variant === 'inline' && 'min-h-32 min-w-48 animate-pulse',
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        onLoad={() => setState('ready')}
        onError={() => setState('failed')}
        className={cn(
          variant === 'thumbnail'
            ? 'size-full object-cover'
            : 'block max-h-[420px] narrow:max-h-[320px] max-w-full object-contain',
          state === 'loading' && 'opacity-0',
        )}
      />
    </button>
  );
}
