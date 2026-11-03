import { Check, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSketchLibrary } from '@/hooks/useSketchLibrary';
import { cn } from '@/lib/utils';
import { useSketchStore } from '@/store/sketchStore';
import { shortTime } from '@/utils/time';

/** Opens another saved sketch. */
export function SketchSwitcher() {
  const { list, open } = useSketchLibrary();
  const current = useSketchStore((state) => state.sketch?.id);
  const [shown, setShown] = useState(false);
  return (
    <Popover open={shown} onOpenChange={setShown}>
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Open a sketch" />}>
        <FolderOpen />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1">
        <ul className="grid max-h-80 overflow-y-auto">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setShown(false);
                  void open(item.id);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted',
                  item.id === current && 'bg-muted',
                )}
              >
                <Check className={cn('size-4 shrink-0', item.id !== current && 'invisible')} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {shortTime(item.updatedAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
