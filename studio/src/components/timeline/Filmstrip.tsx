import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { byFrame, keyAt } from '@/utils/frames';
import { CelCard } from './CelCard';
import { DraftCard } from './DraftCard';
import { KeyCard } from './KeyCard';

/** The snapshots (Motion) or the drawn frames (Effect) in order, as thumbnails. */
export function Filmstrip() {
  const sketch = useSketchStore((state) => state.sketch);
  const mode = useEditorStore((state) => state.mode);
  const draft = useEditorStore((state) => state.draft);
  if (!sketch) {
    return null;
  }
  const showDraft = draft && !keyAt(sketch.motion.keys, draft.frame);
  const keys = byFrame(sketch.motion.keys);
  return (
    <div className="flex min-h-[148px] gap-2 overflow-x-auto px-3 py-2">
      {mode === 'motion' && (
        <>
          {keys.map((key) =>
            showDraft &&
            draft.frame < key.frame &&
            keys.find((k) => k.frame > draft.frame) === key ? (
              <div key={key.id} className="flex gap-2">
                <DraftCard draft={draft} />
                <KeyCard motionKey={key} />
              </div>
            ) : (
              <KeyCard key={key.id} motionKey={key} />
            ),
          )}
          {showDraft && !keys.some((key) => key.frame > draft.frame) && <DraftCard draft={draft} />}
        </>
      )}
      {mode === 'effect' &&
        byFrame(sketch.effect.cels).map((cel) => <CelCard key={cel.id} cel={cel} />)}
    </div>
  );
}
