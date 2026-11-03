import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Layers,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { byFrame } from '@/utils/frames';

function Hint({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className={cn('inline-flex', className)} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Playback and stepping, the frame number, and the onion skin and grid switches. */
export function Transport() {
  const { frame, playing, onion, grid, mode, set, seek, togglePlay } = useEditorStore();
  const sketch = useSketchStore((state) => state.sketch);
  const items: readonly { frame: number }[] =
    mode === 'motion' ? (sketch?.motion.keys ?? []) : (sketch?.effect.cels ?? []);
  const marks = byFrame(items).map((item) => item.frame);
  const previousMark = marks.filter((at) => at < frame).at(-1);
  const nextMark = marks.find((at) => at > frame);
  return (
    <div className="flex items-center gap-1 px-3 py-1.5">
      <Hint label="Previous mark (Shift+Left)" className="narrow:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous mark"
          disabled={previousMark === undefined}
          onClick={() => previousMark !== undefined && seek(previousMark)}
        >
          <SkipBack />
        </Button>
      </Hint>
      <Hint label="Previous frame (Left)">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous frame"
          disabled={frame === 0}
          onClick={() => seek(frame - 1)}
        >
          <ChevronLeft />
        </Button>
      </Hint>
      <Hint label={playing ? 'Pause (Space)' : 'Play (Space)'}>
        <Button
          variant="secondary"
          size="icon"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={togglePlay}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
      </Hint>
      <Hint label="Next frame (Right)">
        <Button variant="ghost" size="icon" aria-label="Next frame" onClick={() => seek(frame + 1)}>
          <ChevronRight />
        </Button>
      </Hint>
      <Hint label="Next mark (Shift+Right)" className="narrow:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next mark"
          disabled={nextMark === undefined}
          onClick={() => nextMark !== undefined && seek(nextMark)}
        >
          <SkipForward />
        </Button>
      </Hint>
      <span className="ml-2 whitespace-nowrap font-pixel text-xs tabular-nums">Frame {frame}</span>
      <span className="ml-auto flex items-center gap-1">
        <Hint label="Onion skin">
          <Toggle
            aria-label="Onion skin"
            pressed={onion}
            onPressedChange={(pressed) => set({ onion: pressed })}
          >
            <Layers />
          </Toggle>
        </Hint>
        <Hint label="Grid">
          <Toggle
            aria-label="Grid"
            pressed={grid}
            onPressedChange={(pressed) => set({ grid: pressed })}
          >
            <Grid3x3 />
          </Toggle>
        </Hint>
      </span>
    </div>
  );
}
