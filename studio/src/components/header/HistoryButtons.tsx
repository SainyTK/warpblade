import { Redo2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMotionStore } from '@/store/motionStore';
import type { SaveStatus } from '@/types/studio';

const SAVE_LABEL: Record<SaveStatus, string> = {
  saved: 'Saved',
  saving: 'Saving',
  failed: 'Not saved',
  reloaded: 'Reloaded from disk',
};

/** Whether the open clip's draft is saved, and undo and redo. */
export function HistoryButtons() {
  const { past, future, undo, redo, saveStatus } = useMotionStore();
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          'mr-1 text-xs',
          saveStatus === 'failed' ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {SAVE_LABEL[saveStatus]}
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
