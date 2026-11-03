import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BRUSH_SIZES, PAINT_TOOLS } from '@/constants/paintTools';
import { useEditorStore } from '@/store/editorStore';

/** The drawing tool and the brush size. */
export function ToolPicker() {
  const { tool, brush, set } = useEditorStore();
  return (
    <div className="grid gap-2">
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[tool]}
        onValueChange={(value) => {
          const next = PAINT_TOOLS.find((option) => option.id === value[0]);
          if (next) {
            set({ tool: next.id });
          }
        }}
      >
        {PAINT_TOOLS.map(({ id, label, icon: Icon, shortcut }) => (
          <Tooltip key={id}>
            <TooltipTrigger render={<ToggleGroupItem value={id} aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent>
              {label} ({shortcut})
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[String(brush)]}
        onValueChange={(value) => {
          const size = Number(value[0]);
          if (size) {
            set({ brush: size });
          }
        }}
      >
        {BRUSH_SIZES.map((size) => (
          <ToggleGroupItem
            key={size}
            value={String(size)}
            aria-label={`Brush ${size} pixels`}
            className="min-w-10"
          >
            {size}px
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
