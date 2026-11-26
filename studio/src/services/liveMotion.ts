import { CLIP_CHANGED, type ClipChange, DRAFT_CHANGED } from '@game/motionClips';
import type { ClipSource } from '@/types/studio';

/** Calls back when the dev server reports a changed clip file or draft. Returns the unsubscribe. */
export function onClipChange(
  listener: (source: ClipSource, change: ClipChange) => void,
): () => void {
  const hot = import.meta.hot;
  if (!hot) {
    return () => {};
  }
  const game = (change: ClipChange) => listener('game', change);
  const draft = (change: ClipChange) => listener('draft', change);
  hot.on(CLIP_CHANGED, game);
  hot.on(DRAFT_CHANGED, draft);
  return () => {
    hot.off(CLIP_CHANGED, game);
    hot.off(DRAFT_CHANGED, draft);
  };
}
