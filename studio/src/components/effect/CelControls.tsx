import { Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToolFrame } from '@/hooks/useToolFrame';
import { useEditorStore } from '@/store/editorStore';
import { useEffectCels, useSketchStore } from '@/store/sketchStore';
import { celAt, neighbours } from '@/utils/frames';
import { addCel, removeCel, updateCel } from '@/utils/sketchEdits';
import { NumberField } from '../common/NumberField';
import { SwitchRow } from '../common/SwitchRow';

const NEW_HOLD = 2;

/** Effect frames: a new blank or copied frame at the playhead, how long the current one holds, delete it. */
export function CelControls() {
  const cels = useEffectCels();
  const change = useSketchStore((state) => state.change);
  const frame = useToolFrame();
  const underlay = useEditorStore((state) => state.underlay);
  const set = useEditorStore((state) => state.set);
  const cel = celAt(cels, frame);
  const starts = cels.some((item) => item.frame === frame);
  const previous = neighbours(cels, frame).before ?? cel;
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          disabled={starts}
          onClick={() => change((sketch) => addCel(sketch, frame, NEW_HOLD))}
        >
          <Plus />
          New frame
        </Button>
        <Button
          variant="outline"
          disabled={starts || !previous}
          onClick={() => change((sketch) => addCel(sketch, frame, NEW_HOLD, previous))}
        >
          <Copy />
          Copy last
        </Button>
      </div>
      {cel && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Frame {cel.frame}</span>
          <div className="w-24">
            <NumberField
              label="hold"
              value={cel.hold}
              step={1}
              onChange={(hold) =>
                change((sketch) =>
                  updateCel(sketch, cel.id, { hold: Math.max(1, Math.round(hold)) }),
                )
              }
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete this frame"
            className="ml-auto text-destructive"
            onClick={() => change((sketch) => removeCel(sketch, cel.id))}
          >
            <Trash2 />
          </Button>
        </div>
      )}
      <SwitchRow label="Show Kael" checked={underlay} onChange={(on) => set({ underlay: on })} />
    </div>
  );
}
