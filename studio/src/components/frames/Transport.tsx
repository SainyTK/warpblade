import { ChevronLeft, ChevronRight, Grid3x3, Layers, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { Hint } from '../common/Hint';

/** Playback and stepping, the frame number, and the onion skin and grid switches. */
export function Transport() {
  const { frame, playing, onion, grid, set, seek, togglePlay } = useEditorStore();
  const count = useMotionStore((state) => state.current.frames.length);
  return (
    <div className="flex items-center gap-1 px-3 py-1.5">
      <Hint label="Previous frame (Left)">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous frame"
          onClick={() => seek((frame - 1 + count) % count)}
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
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next frame"
          onClick={() => seek((frame + 1) % count)}
        >
          <ChevronRight />
        </Button>
      </Hint>
      <span className="ml-2 whitespace-nowrap font-pixel text-xs tabular-nums">
        Frame {frame} of {count}
      </span>
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
