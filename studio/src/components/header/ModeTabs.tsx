import { Brush, PersonStanding } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEditorStore } from '@/store/editorStore';

/** Motion poses Kael; Effect draws over him. */
export function ModeTabs() {
  const { mode, set, pause } = useEditorStore();
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      value={[mode]}
      onValueChange={(value) => {
        if (value[0] === 'motion' || value[0] === 'effect') {
          pause();
          set({ mode: value[0] });
        }
      }}
    >
      <ToggleGroupItem value="motion" aria-label="Motion">
        <PersonStanding />
        Motion
      </ToggleGroupItem>
      <ToggleGroupItem value="effect" aria-label="Effect">
        <Brush />
        Effect
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
