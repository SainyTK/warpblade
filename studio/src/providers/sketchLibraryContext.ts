import type { SketchSummary } from '@shared/sketch';
import { createContext } from 'react';
import type { SaveStatus } from '@/hooks/useAutosave';

export interface SketchLibrary {
  list: SketchSummary[];
  error: string | null;
  status: SaveStatus;
  open: (id: string) => Promise<void>;
  create: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const SketchLibraryContext = createContext<SketchLibrary | null>(null);
