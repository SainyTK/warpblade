import type { PointerEvent } from 'react';
import { useRef } from 'react';

/**
 * Dragging along the frame track: reports the frame under the pointer on press and on every move.
 * `onStart` runs once a drag actually moves, so a plain click can seek without an undo step.
 */
export function useTrackDrag(
  framePx: number,
  onFrame: (frame: number, moved: boolean) => void,
  onStart?: () => void,
) {
  const state = useRef<{ startX: number; moved: boolean; left: number } | null>(null);
  const frameAt = (clientX: number) =>
    Math.max(0, Math.floor((clientX - (state.current?.left ?? 0)) / framePx));
  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
      const track = event.currentTarget.closest('[data-track]') as HTMLElement | null;
      state.current = {
        startX: event.clientX,
        moved: false,
        left: track?.getBoundingClientRect().left ?? 0,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      onFrame(frameAt(event.clientX), false);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const active = state.current;
      if (!active) {
        return;
      }
      if (!active.moved && Math.abs(event.clientX - active.startX) > 3) {
        active.moved = true;
        onStart?.();
      }
      if (active.moved) {
        onFrame(frameAt(event.clientX), true);
      }
    },
    onPointerUp: () => {
      state.current = null;
    },
  };
}
