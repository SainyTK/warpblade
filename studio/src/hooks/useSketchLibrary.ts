import { useContext } from 'react';
import { type SketchLibrary, SketchLibraryContext } from '@/providers/sketchLibraryContext';

export function useSketchLibrary(): SketchLibrary {
  const library = useContext(SketchLibraryContext);
  if (!library) {
    throw new Error('SketchLibraryProvider is required');
  }
  return library;
}
