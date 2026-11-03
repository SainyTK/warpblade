import { ANIM_FPS } from '@game/constants/hero';
import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useLastFrame } from './useTimelineLength';

/** While playing, steps the playhead at the game's 30 frames a second and loops over the sketch. */
export function usePlayback(): void {
  const playing = useEditorStore((state) => state.playing);
  const last = useLastFrame();
  useEffect(() => {
    if (!playing) {
      return;
    }
    let raf = 0;
    let start = performance.now();
    let base = useEditorStore.getState().frame;
    const tick = (now: number) => {
      let frame = base + Math.floor(((now - start) / 1000) * ANIM_FPS);
      if (frame > last) {
        start = now;
        base = 0;
        frame = 0;
      }
      if (frame !== useEditorStore.getState().frame) {
        useEditorStore.getState().set({ frame, draft: null });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, last]);
}
