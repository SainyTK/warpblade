import type { Color } from '@game/types/color';
import type { EffectCel } from '@shared/sketch';
import { pixelKey } from '@shared/utils/celRows';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import type { Point } from '@/types/studio';
import { byFrame, celAt } from '@/utils/frames';
import { brushPoints, floodFill, linePoints, paintPoints } from '@/utils/paint';
import { addCel, updateCel } from '@/utils/sketchEdits';

/** A new frame lasts until the next drawn frame, or this many frames when none follows. */
const DEFAULT_HOLD = 2;

/** Paints into the effect frame at the playhead, making one when the playhead has none. */
export function useCelPainter() {
  const change = useSketchStore((state) => state.change);
  const checkpoint = useSketchStore((state) => state.checkpoint);

  /** The frame to paint, created when missing. Starts the gesture's undo step either way. */
  const begin = (): EffectCel | null => {
    const { frame } = useEditorStore.getState();
    const cels = useSketchStore.getState().sketch?.effect.cels ?? [];
    const existing = celAt(cels, frame);
    if (existing) {
      checkpoint();
      return existing;
    }
    const next = byFrame(cels).find((cel) => cel.frame > frame);
    change((sketch) => addCel(sketch, frame, next ? next.frame - frame : DEFAULT_HOLD));
    return celAt(useSketchStore.getState().sketch?.effect.cels ?? [], frame) ?? null;
  };

  const pixelsOf = (id: string) =>
    useSketchStore.getState().sketch?.effect.cels.find((cel) => cel.id === id)?.pixels ?? {};

  const stroke = (id: string, from: Point, to: Point, color: Color | null, brush: number) => {
    const points = linePoints(from, to).flatMap((point) => brushPoints(point, brush));
    change(
      (sketch) => updateCel(sketch, id, { pixels: paintPoints(pixelsOf(id), points, color) }),
      false,
    );
  };

  const fill = (id: string, at: Point, color: Color | null) => {
    change(
      (sketch) => updateCel(sketch, id, { pixels: floodFill(pixelsOf(id), at, color) }),
      false,
    );
  };

  /** The color under a point in the frame at the playhead, if any. */
  const pick = (at: Point): Color | null => {
    const { frame } = useEditorStore.getState();
    const cel = celAt(useSketchStore.getState().sketch?.effect.cels ?? [], frame);
    return cel?.pixels[pixelKey(at[0], at[1])] ?? null;
  };

  return { begin, stroke, fill, pick };
}
