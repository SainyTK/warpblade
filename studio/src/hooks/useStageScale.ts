import { type RefObject, useEffect, useState } from 'react';
import { STAGE_H, STAGE_W } from '@/constants/stage';

/** The largest whole-number scale at which the stage window fits its container, so pixels stay square. */
export function useStageScale(container: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(3);
  useEffect(() => {
    const element = container.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      setScale(Math.max(1, Math.floor(Math.min(width / STAGE_W, height / STAGE_H))));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [container]);
  return scale;
}
