import { ClipboardPaste, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameClip } from '@/hooks/useGameClip';
import { useOpenMotion } from '@/hooks/useOpenMotion';
import { usePoseEditor } from '@/hooks/usePoseEditor';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { setSnap } from '@/utils/clipEdits';
import { Hint } from '../common/Hint';
import { SwitchRow } from '../common/SwitchRow';

/** The frame's snap, and copying, pasting or resetting its pose. */
export function FrameActions() {
  const editor = usePoseEditor();
  const game = useGameClip(useOpenMotion().id).frames[editor.frame];
  const snap = useMotionStore((state) => state.current.snaps.includes(editor.frame));
  const change = useMotionStore((state) => state.change);
  const copied = useEditorStore((state) => state.copied);
  const set = useEditorStore((state) => state.set);
  return (
    <div className="grid gap-2">
      <SwitchRow
        label="Snap to this frame"
        checked={snap}
        onChange={(on) => change((clip) => setSnap(clip, editor.frame, on))}
      />
      <div className="grid grid-cols-3 gap-1.5">
        <Hint label="Copy this pose (Ctrl+C)">
          <Button
            variant="secondary"
            size="sm"
            className="w-full px-2"
            onClick={() => set({ copied: { ...editor.pose } })}
          >
            <Copy />
            Copy
          </Button>
        </Hint>
        <Hint label="Paste the copied pose here (Ctrl+V)">
          <Button
            variant="secondary"
            size="sm"
            className="w-full px-2"
            disabled={!copied}
            onClick={() => copied && editor.setPose({ ...copied })}
          >
            <ClipboardPaste />
            Paste
          </Button>
        </Hint>
        <Hint label="Back to the game's pose for this frame">
          <Button
            variant="secondary"
            size="sm"
            className="w-full px-2"
            disabled={!game}
            onClick={() => game && editor.setPose({ ...game })}
          >
            <RotateCcw />
            Reset
          </Button>
        </Hint>
      </div>
    </div>
  );
}
