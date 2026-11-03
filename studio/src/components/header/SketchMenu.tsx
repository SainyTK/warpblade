import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSketchLibrary } from '@/hooks/useSketchLibrary';
import { deleteSketch } from '@/services/sketchApi';
import { useSketchStore } from '@/store/sketchStore';
import { SketchSwitcher } from './SketchSwitcher';

/** The open sketch: rename it, open another, start a new one or delete it. */
export function SketchMenu() {
  const { list, open, create, refresh } = useSketchLibrary();
  const sketch = useSketchStore((state) => state.sketch);
  const change = useSketchStore((state) => state.change);
  const [name, setName] = useState(sketch?.name ?? '');
  useEffect(() => setName(sketch?.name ?? ''), [sketch?.name]);
  if (!sketch) {
    return null;
  }
  const rename = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== sketch.name) {
      change((current) => ({ ...current, name: trimmed }));
    } else {
      setName(sketch.name);
    }
  };
  const remove = async () => {
    await deleteSketch(sketch.id);
    const next = list.find((item) => item.id !== sketch.id);
    if (next) {
      await open(next.id);
    } else {
      await create();
    }
    await refresh();
  };
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <SketchSwitcher />
      <Input
        aria-label="Sketch name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={rename}
        onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
        className="h-8 w-48"
      />
      <Button variant="ghost" size="icon" aria-label="New sketch" onClick={() => void create()}>
        <Plus />
      </Button>
      <Dialog>
        <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Delete sketch" />}>
          <Trash2 />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete "{sketch.name}"?</DialogTitle>
            <DialogDescription>
              Its snapshots and drawn frames are removed. Agent jobs keep their copy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Keep</DialogClose>
            <DialogClose render={<Button variant="destructive" onClick={() => void remove()} />}>
              Delete
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
