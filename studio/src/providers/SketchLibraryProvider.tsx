import { type ReactNode, useMemo } from 'react';
import { useAutosave } from '@/hooks/useAutosave';
import { useSketches } from '@/hooks/useSketches';
import { type SketchLibrary, SketchLibraryContext } from './sketchLibraryContext';

/** Owns the saved sketches, opening one and autosaving the open one. */
export function SketchLibraryProvider({ children }: { children: ReactNode }) {
  const { list, error, open, create, refresh } = useSketches();
  const status = useAutosave(refresh);
  const value = useMemo<SketchLibrary>(
    () => ({ list, error, status, open, create, refresh }),
    [list, error, status, open, create, refresh],
  );
  return <SketchLibraryContext.Provider value={value}>{children}</SketchLibraryContext.Provider>;
}
