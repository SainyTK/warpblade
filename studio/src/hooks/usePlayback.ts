import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { framesPerSecond } from '@/utils/clipTiming';
import { useOpenMotion } from './useOpenMotion';

/** While playing, steps the playhead at the speed the game plays the clip, looping over it. */
export function usePlayback(): void {
  const playing = useEditorStore((state) => state.playing);
  const count = useMotionStore((state) => state.current.frames.length);
  const fps = framesPerSecond(useOpenMotion(), count);
  useEffect(() => {
    if (!playing) {
      return;
    }
    const start = performance.now();
    const base = useEditorStore.getState().frame;
    let raf = 0;
    const tick = (now: number) => {
      const frame = (base + Math.floor(((now - start) / 1000) * fps)) % count;
      if (frame !== useEditorStore.getState().frame) {
        useEditorStore.getState().set({ frame });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, count, fps]);
}
