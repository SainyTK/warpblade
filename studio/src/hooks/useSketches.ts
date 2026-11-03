import type { SketchSummary } from '@shared/sketch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { lastSketchId, rememberSketch } from '@/services/prefs';
import { getSketch, listSketches, saveSketch } from '@/services/sketchApi';
import { useSketchStore } from '@/store/sketchStore';
import { emptySketch, withCurrentRig } from '@/utils/sketch';

const FIRST_NAME = 'Untitled sketch';

/** The saved sketches, and opening one: the last one used, else the newest, else a new one. */
export function useSketches() {
  const [list, setList] = useState<SketchSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = useSketchStore((state) => state.load);
  // StrictMode runs effects twice in development; the first sketch must be made once.
  const booted = useRef(false);

  const refresh = useCallback(async () => {
    try {
      setList(await listSketches());
      setError(null);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'The sketches could not be read.');
    }
  }, []);

  const open = useCallback(
    async (id: string) => {
      load(withCurrentRig(await getSketch(id)));
      rememberSketch(id);
    },
    [load],
  );

  const create = useCallback(
    async (name = FIRST_NAME) => {
      const sketch = emptySketch(name);
      await saveSketch(sketch);
      load(sketch);
      rememberSketch(sketch.id);
      await refresh();
    },
    [load, refresh],
  );

  useEffect(() => {
    if (booted.current) {
      return;
    }
    booted.current = true;
    const boot = async () => {
      const sketches = await listSketches();
      setList(sketches);
      const remembered = sketches.find((sketch) => sketch.id === lastSketchId());
      const first = remembered ?? sketches[0];
      if (first) {
        await open(first.id);
      } else {
        await create();
      }
    };
    boot().catch((problem: unknown) =>
      setError(problem instanceof Error ? problem.message : 'The studio server is not running.'),
    );
  }, [open, create]);

  return { list, error, refresh, open, create };
}
