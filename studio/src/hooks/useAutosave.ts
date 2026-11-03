import { useEffect, useState } from 'react';
import { saveSketch } from '@/services/sketchApi';
import { useSketchStore } from '@/store/sketchStore';

const SAVE_DELAY_MS = 600;

export type SaveStatus = 'saved' | 'saving' | 'failed';

/** Saves the open sketch shortly after each change. */
export function useAutosave(onSaved: () => void): SaveStatus {
  const sketch = useSketchStore((state) => state.sketch);
  const revision = useSketchStore((state) => state.revision);
  const [status, setStatus] = useState<SaveStatus>('saved');
  useEffect(() => {
    if (!sketch || revision === 0) {
      return;
    }
    setStatus('saving');
    const timer = setTimeout(() => {
      saveSketch(sketch)
        .then(() => {
          setStatus('saved');
          onSaved();
        })
        .catch(() => setStatus('failed'));
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [sketch, revision, onSaved]);
  return status;
}
