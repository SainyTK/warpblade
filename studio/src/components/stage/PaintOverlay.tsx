import { type PointerEvent, useRef, useState } from 'react';
import { ORIGIN_X, ORIGIN_Y } from '@/constants/stage';
import { useCelPainter } from '@/hooks/useCelPainter';
import { stagePoint, useOverlayCanvas } from '@/hooks/useOverlayCanvas';
import { useEditorStore } from '@/store/editorStore';
import type { PaintTool, Point } from '@/types/studio';
import { brushPoints, linePoints, toCel } from '@/utils/paint';

interface Stroke {
  id: string;
  tool: PaintTool;
  from: Point;
  last: Point;
}

/** Draws the effect frame at the playhead: pencil, eraser, line, fill and color picker. Alt picks a color. */
export function PaintOverlay({ scale }: { scale: number }) {
  const { tool, color, brush, playing, set } = useEditorStore();
  const painter = useCelPainter();
  const [cursor, setCursor] = useState<Point | null>(null);
  const stroke = useRef<Stroke | null>(null);

  const canvas = useOverlayCanvas(scale, (context) => {
    if (!cursor || playing) {
      return;
    }
    const active = stroke.current;
    const preview =
      active?.tool === 'line'
        ? linePoints(active.from, cursor).flatMap((point) => brushPoints(point, brush))
        : brushPoints(cursor, tool === 'fill' || tool === 'picker' ? 1 : brush);
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.globalAlpha = active?.tool === 'line' ? 0.9 : 0.5;
    for (const [x, y] of preview) {
      context.fillRect(ORIGIN_X + x, ORIGIN_Y + y, 1, 1);
    }
    context.globalAlpha = 1;
  });

  const celPoint = (event: PointerEvent<HTMLCanvasElement>): Point | null =>
    canvas.current ? toCel(stagePoint(event, canvas.current, scale)) : null;

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const at = celPoint(event);
    if (playing || !at) {
      return;
    }
    const current = event.altKey ? 'picker' : tool;
    if (current === 'picker') {
      const picked = painter.pick(at);
      if (picked) {
        set({ color: picked, tool: tool === 'picker' ? 'pencil' : tool });
      }
      return;
    }
    const cel = painter.begin();
    if (!cel) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const paint = current === 'eraser' ? null : color;
    if (current === 'fill') {
      painter.fill(cel.id, at, paint);
      return;
    }
    stroke.current = { id: cel.id, tool: current, from: at, last: at };
    if (current !== 'line') {
      painter.stroke(cel.id, at, at, paint, brush);
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const at = celPoint(event);
    setCursor(at);
    const active = stroke.current;
    if (!at || !active || active.tool === 'line') {
      return;
    }
    painter.stroke(active.id, active.last, at, active.tool === 'eraser' ? null : color, brush);
    active.last = at;
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const active = stroke.current;
    const at = celPoint(event);
    if (active?.tool === 'line' && at) {
      painter.stroke(active.id, active.from, at, color, brush);
    }
    stroke.current = null;
  };

  return (
    <canvas
      ref={canvas}
      aria-label="Effect drawing"
      className="absolute inset-0 cursor-crosshair touch-none"
      style={{ width: '100%', height: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        stroke.current = null;
      }}
      onPointerLeave={() => setCursor(null)}
    />
  );
}
