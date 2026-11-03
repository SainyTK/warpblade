import { type PointerEvent, useRef, useState } from 'react';
import { HANDLE_REACH, JOINT_HANDLES, type JointHandle, RIG_BONES } from '@/constants/joints';
import { stagePoint, useOverlayCanvas } from '@/hooks/useOverlayCanvas';
import { usePoseEditor } from '@/hooks/usePoseEditor';
import { useEditorStore } from '@/store/editorStore';
import type { Point } from '@/types/studio';
import { type Dragged, dragHandle, handlePoint } from '@/utils/jointGeometry';

interface Drag {
  handle: JointHandle;
  start: Dragged;
}

/**
 * The rig's handles over Kael: drag a joint, the sword tip, the feet, the chest to bend the spine, a toe to tilt the
 * foot, or an elbow across the arm to flip its bend. Shift-drag the hip to carry the upper body.
 */
export function RigOverlay({ scale }: { scale: number }) {
  const editor = usePoseEditor();
  const playing = useEditorStore((state) => state.playing);
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<Drag | null>(null);
  const points = new Map<string, Point>(
    JOINT_HANDLES.map((handle) => [handle.id, handlePoint(handle, editor.pose, editor.root)]),
  );

  const canvas = useOverlayCanvas(scale, (context) => {
    if (playing) {
      return;
    }
    context.lineWidth = 1 / scale;
    context.strokeStyle = 'rgba(230, 228, 240, 0.35)';
    for (const [a, b] of RIG_BONES) {
      const from = points.get(a);
      const to = points.get(b);
      if (from && to) {
        context.beginPath();
        context.moveTo(from[0], from[1]);
        context.lineTo(to[0], to[1]);
        context.stroke();
      }
    }
    for (const handle of JOINT_HANDLES) {
      const [x, y] = points.get(handle.id) ?? [0, 0];
      const active = hover === handle.id || drag.current?.handle.id === handle.id;
      const radius = (active ? 6 : handle.minor ? 3 : 4.5) / scale;
      context.beginPath();
      if (handle.kind === 'root') {
        context.moveTo(x, y - radius);
        context.lineTo(x + radius, y);
        context.lineTo(x, y + radius);
        context.lineTo(x - radius, y);
        context.closePath();
      } else {
        context.arc(x, y, radius, 0, Math.PI * 2);
      }
      context.fillStyle = handle.color;
      context.globalAlpha = handle.far ? 0.75 : 0.95;
      context.fill();
      context.globalAlpha = 1;
      context.lineWidth = 1.5 / scale;
      context.strokeStyle = '#07060f';
      context.stroke();
      if (active) {
        context.font = `${11 / scale}px "IBM Plex Mono", monospace`;
        context.fillStyle = '#e6e4f0';
        context.fillText(handle.label, x + 8 / scale, y - 8 / scale);
      }
    }
  });

  const nearest = (point: Point): JointHandle | null => {
    let best: JointHandle | null = null;
    let bestDistance = HANDLE_REACH / scale;
    for (const handle of JOINT_HANDLES) {
      const [x, y] = points.get(handle.id) ?? [0, 0];
      const distance = Math.hypot(x - point[0], y - point[1]);
      if (distance <= bestDistance) {
        best = handle;
        bestDistance = distance;
      }
    }
    return best;
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (playing || !canvas.current) {
      return;
    }
    const handle = nearest(stagePoint(event, canvas.current, scale));
    if (!handle) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    editor.beginGesture();
    drag.current = { handle, start: { pose: editor.pose, root: editor.root } };
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!canvas.current) {
      return;
    }
    const point = stagePoint(event, canvas.current, scale);
    const active = drag.current;
    if (!active) {
      setHover(playing ? null : (nearest(point)?.id ?? null));
      return;
    }
    const next = dragHandle(active.handle, active.start, point, event.shiftKey);
    editor.setPose(next.pose, next.root, false);
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <canvas
      ref={canvas}
      aria-label="Kael's rig"
      className="absolute inset-0 touch-none"
      style={{ width: '100%', height: '100%', cursor: hover ? 'grab' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setHover(null)}
    />
  );
}
