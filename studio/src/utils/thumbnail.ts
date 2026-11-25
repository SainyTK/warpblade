import { RES } from '@game/constants/stage';
import type { SpriteImage } from '@game/types/sprite';
import { STAGE_COLORS, THUMB } from '@/constants/stage';
import type { Raster } from '@/types/studio';
import { blitSprite, putArt, raster } from './raster';

/** A small picture of a drawn hero, centred on their feet over the ground line. */
export function thumbnail(sprite: SpriteImage): Raster {
  const r = raster(THUMB.w, THUMB.h, STAGE_COLORS.background, RES);
  for (let x = 0; x < THUMB.w; x++) {
    putArt(r, x, THUMB.above, STAGE_COLORS.ground);
  }
  blitSprite(r, sprite, THUMB.w / 2, THUMB.above);
  return r;
}
