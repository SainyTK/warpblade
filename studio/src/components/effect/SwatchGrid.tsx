import { SWATCH_GROUPS } from '@/constants/swatches';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';

const css = (color: number): string => `#${color.toString(16).padStart(6, '0')}`;

/** The game's color ramps, named as the code names them, dark to bright. */
export function SwatchGrid() {
  const { color, set } = useEditorStore();
  return (
    <div className="grid gap-1.5">
      {SWATCH_GROUPS.map((group) => (
        <div key={group.id} className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
          <span className="truncate text-[11px] text-muted-foreground">{group.label}</span>
          <div className="flex flex-wrap gap-0.5">
            {group.colors.map((swatch, index) => (
              <button
                // A ramp can repeat a color, so the index keeps keys apart.
                // biome-ignore lint/suspicious/noArrayIndexKey: ramps are fixed lists.
                key={index}
                type="button"
                aria-label={`${group.label} ${index}`}
                aria-pressed={swatch === color}
                onClick={() => set({ color: swatch, tool: 'pencil' })}
                className={cn(
                  'size-5 rounded-[3px] border border-black/40',
                  swatch === color && 'ring-2 ring-foreground ring-offset-1 ring-offset-background',
                )}
                style={{ background: css(swatch) }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
