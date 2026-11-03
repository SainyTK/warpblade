import type { ImageRef } from '@shared/api';
import { createContext } from 'react';

export interface MediaViewer {
  open: (image: ImageRef) => void;
}

export const MediaViewerContext = createContext<MediaViewer | null>(null);
