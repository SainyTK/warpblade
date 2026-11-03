import { Redo2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SaveStatus } from '@/hooks/useAutosave';
import { useSketchLibrary } from '@/hooks/useSketchLibrary';
import { cn } from '@/lib/utils';
import { useSketchStore } from '@/store/sketchStore';

const SAVE_LABEL: Record<SaveStatus, string> = {
  saved: 'Saved',
  saving: 'Saving',
  failed: 'Not saved',
};

/** Undo, redo and whether the sketch is saved. */
export function HistoryButtons() {
  const { status } = useSketchLibrary();
  const { past, future, undo, redo } = useSketchStore();
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          'mr-1 text-xs',
          status === 'failed' ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {SAVE_LABEL[status]}
      </span>
      <Button variant="ghost" size="icon" aria-label="Undo" disabled={!past.length} onClick={undo}>
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Redo"
        disabled={!future.length}
        onClick={redo}
      >
        <Redo2 />
      </Button>
    </div>
  );
}
