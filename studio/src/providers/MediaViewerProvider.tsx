import type { ImageRef } from '@shared/api';
import { type ReactNode, useMemo, useState } from 'react';
import { AgentImageViewer } from '@/components/agent/AgentImageViewer';
import { MediaViewerContext } from './mediaViewerContext';

/** Owns the full-size image viewer, so any image in the chat can open it. */
export function MediaViewerProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<ImageRef | null>(null);
  const viewer = useMemo(() => ({ open: setImage }), []);
  return (
    <MediaViewerContext.Provider value={viewer}>
      {children}
      {image && <AgentImageViewer image={image} onClose={() => setImage(null)} />}
    </MediaViewerContext.Provider>
  );
}
