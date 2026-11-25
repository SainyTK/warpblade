import { useRef } from 'react';
import { STAGE_H, STAGE_W } from '@/constants/stage';
import { useStageRaster } from '@/hooks/useStageRaster';
import { useStageScale } from '@/hooks/useStageScale';
import { RasterCanvas } from '../common/RasterCanvas';
import { RigOverlay } from './RigOverlay';

/** The stage window at the largest whole-pixel scale that fits, with the rig's handles over Kael. */
export function Stage() {
  const container = useRef<HTMLDivElement>(null);
  const scale = useStageScale(container);
  const raster = useStageRaster();
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
        <RigOverlay scale={scale} />
      </div>
    </div>
  );
}
