import type { Pose } from '@game/types/pose';
import { ORIGIN_X, ORIGIN_Y } from '@/constants/stage';
import type { Raster } from '@/types/studio';
import { cropRaster } from './crop';
import { stageRaster, stillHero } from './stageRaster';

/** Thumbnails show this much of the stage around Kael's feet. */
const THUMB = { w: 48, h: 56, above: 48 } as const;
/** Thumbnails are drawn at this scale. */
export const THUMB_SCALE = 2;

/** A small picture of a snapshot or an effect frame, centred on where Kael stands. */
export function thumbnail(
  hero: { pose: Pose; root: { x: number; y: number } } | null,
  pixels: Readonly<Record<string, number>> | null,
  heroAlpha = 1,
): Raster {
  const root = hero?.root ?? { x: 0, y: 0 };
  const full = stageRaster({
    hero: hero ? stillHero(hero.pose, hero.root) : null,
    heroAlpha,
    onions: [],
    pixels,
    pixelOnions: [],
    grid: false,
    background: true,
  });
  return cropRaster(full, {
    x: ORIGIN_X + Math.round(root.x) - THUMB.w / 2,
    y: ORIGIN_Y + Math.round(root.y) - THUMB.above,
    w: THUMB.w,
    h: THUMB.h,
  });
}
