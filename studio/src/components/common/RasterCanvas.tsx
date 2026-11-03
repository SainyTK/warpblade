import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Raster } from '@/types/studio';
import { rgba } from '@/utils/raster';

interface RasterCanvasProps {
  raster: Raster;
  scale: number;
  className?: string;
}

/** A raster drawn at whole-pixel scale with crisp pixels. */
export function RasterCanvas({ raster, scale, className }: RasterCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    ref.current?.getContext('2d')?.putImageData(new ImageData(rgba(raster), raster.w), 0, 0);
  }, [raster]);
  return (
    <canvas
      ref={ref}
      width={raster.w}
      height={raster.h}
      className={cn('[image-rendering:pixelated]', className)}
      style={{ width: raster.w * scale, height: raster.h * scale }}
    />
  );
}
