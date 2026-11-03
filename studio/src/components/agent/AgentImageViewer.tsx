import type { ImageRef } from '@shared/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

/** An image at full size, fitted to the screen. Escape, the close button or a tap beside it closes it. */
export function AgentImageViewer({ image, onClose }: { image: ImageRef; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-max min-w-[min(320px,calc(100vw-24px))] max-w-[calc(100vw-24px)] gap-2 bg-card p-2 pt-11 sm:max-w-[calc(100vw-48px)]">
        <DialogTitle className="absolute top-3.5 left-3 max-w-[calc(100%-56px)] truncate font-normal text-[13px] text-muted-foreground">
          {image.alt}
        </DialogTitle>
        <DialogDescription className="sr-only">Full-size image</DialogDescription>
        <img
          src={image.src}
          alt={image.alt}
          className="mx-auto block max-h-[calc(100dvh-96px)] max-w-[calc(100vw-40px)] rounded-md object-contain sm:max-w-[calc(100vw-64px)]"
        />
      </DialogContent>
    </Dialog>
  );
}
