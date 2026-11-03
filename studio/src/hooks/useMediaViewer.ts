import { useContext } from 'react';
import { MediaViewerContext } from '@/providers/mediaViewerContext';

export function useMediaViewer() {
  const viewer = useContext(MediaViewerContext);
  if (!viewer) {
    throw new Error('MediaViewerProvider is required');
  }
  return viewer;
}
