import { type RefObject, useEffect, useRef } from 'react';
import { STAGE_H, STAGE_W } from '@/constants/stage';

/**
 * A canvas over the stage at screen resolution. `draw` gets a context scaled so one unit is one art pixel.
 * Returns the canvas ref.
 */
export function useOverlayCanvas(
  scale: number,
  draw: (context: CanvasRenderingContext2D) => void,
): RefObject<HTMLCanvasElement | null> {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }
    const ratio = window.devicePixelRatio || 1;
    canvas.width = STAGE_W * scale * ratio;
    canvas.height = STAGE_H * scale * ratio;
    context.setTransform(scale * ratio, 0, 0, scale * ratio, 0, 0);
    context.clearRect(0, 0, STAGE_W, STAGE_H);
    draw(context);
  });
  return ref;
}

/** A pointer position in art pixels on the stage. */
export function stagePoint(
  event: { clientX: number; clientY: number },
  canvas: HTMLElement,
  scale: number,
): [number, number] {
  const box = canvas.getBoundingClientRect();
  return [(event.clientX - box.left) / scale, (event.clientY - box.top) / scale];
}
