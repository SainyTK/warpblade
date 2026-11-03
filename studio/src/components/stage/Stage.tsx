import { useRef } from 'react';
import { STAGE_H, STAGE_W } from '@/constants/stage';
import { useStageRaster } from '@/hooks/useStageRaster';
import { useStageScale } from '@/hooks/useStageScale';
import { useEditorStore } from '@/store/editorStore';
import { RasterCanvas } from '../common/RasterCanvas';
import { PaintOverlay } from './PaintOverlay';
import { RigOverlay } from './RigOverlay';

/** The stage window at the largest whole-pixel scale that fits, with the mode's tools over it. */
export function Stage() {
  const container = useRef<HTMLDivElement>(null);
  const scale = useStageScale(container);
  const raster = useStageRaster();
  const mode = useEditorStore((state) => state.mode);
  return (
    <div
      ref={container}
      className="flex min-h-0 flex-1 items-center justify-center overflow-hidden"
    >
      <div
        className="relative rounded-sm shadow-[0_0_0_1px_var(--border)]"
        style={{ width: STAGE_W * scale, height: STAGE_H * scale }}
      >
        <RasterCanvas raster={raster} scale={scale} className="absolute inset-0" />
        {mode === 'motion' ? <RigOverlay scale={scale} /> : <PaintOverlay scale={scale} />}
      </div>
    </div>
  );
}
