import { Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePoseEditor } from '@/hooks/usePoseEditor';
import { useToolFrame } from '@/hooks/useToolFrame';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { removeKey, setHit, updateKey } from '@/utils/sketchEdits';
import { NumberField } from '../common/NumberField';
import { SwitchRow } from '../common/SwitchRow';

/** Take a snapshot of the pose; on a snapshot, set how it plays (snap, hit) or delete it. */
export function SnapshotControls() {
  const editor = usePoseEditor();
  const change = useSketchStore((state) => state.change);
  const hitFrame = useSketchStore((state) => state.sketch?.motion.hitFrame ?? null);
  const frame = useToolFrame();
  const snapshotGap = useEditorStore((state) => state.snapshotGap);
  const set = useEditorStore((state) => state.set);
  const key = editor.key;
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Button className="flex-1" onClick={editor.takeSnapshot}>
          <Camera />
          Snapshot
        </Button>
        <div className="w-24">
          <NumberField
            label="gap"
            value={snapshotGap}
            step={1}
            onChange={(gap) => set({ snapshotGap: Math.max(1, Math.round(gap)) })}
          />
        </div>
      </div>
      {key && (
        <>
          <SwitchRow
            label="Snap to this pose"
            checked={key.snap}
            onChange={(snap) => change((sketch) => updateKey(sketch, key.id, { snap }))}
          />
          <SwitchRow
            label="Hit frame"
            checked={hitFrame === frame}
            onChange={(on) => change((sketch) => setHit(sketch, on ? frame : null))}
          />
          <Button
            variant="ghost"
            className="justify-start text-destructive"
            onClick={() => change((sketch) => removeKey(sketch, key.id))}
          >
            <Trash2 />
            Delete snapshot
          </Button>
        </>
      )}
    </div>
  );
}
