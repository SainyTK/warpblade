import { RES } from '@game/constants/stage';
import type { HeroSkin } from '@game/types/character';
import type { Color } from '@game/types/color';
import type { Pose } from '@game/types/pose';
import { ONION, ORIGIN_X, ORIGIN_Y, STAGE_COLORS, STAGE_H, STAGE_W } from '@/constants/stage';
import type { HeroLayer, Raster } from '@/types/studio';
import { heroSprite } from './heroSprite';
import { blitSprite, putArt, raster } from './raster';
import { stillSprite } from './stillSprite';

export interface StageLayers {
  skin: HeroSkin;
  hero: HeroLayer | null;
  onions: { pose: Pose; tint: Color }[];
  grid: boolean;
}

function drawBackdrop(r: Raster, grid: boolean): void {
  if (grid) {
    for (let y = 0; y < STAGE_H; y++) {
      for (let x = 0; x < STAGE_W; x++) {
        if ((x - ORIGIN_X) % 8 === 0 && (y - ORIGIN_Y) % 8 === 0) {
          putArt(r, x, y, STAGE_COLORS.grid);
        }
      }
    }
  }
  for (let x = 0; x < STAGE_W; x++) {
    putArt(r, x, ORIGIN_Y, STAGE_COLORS.ground);
  }
  putArt(r, ORIGIN_X, ORIGIN_Y, STAGE_COLORS.origin);
}

/** The stage window: backdrop, onion skins and the hero, at the game's detail (RES to an art pixel). */
export function stageRaster(layers: StageLayers): Raster {
  const r = raster(STAGE_W, STAGE_H, STAGE_COLORS.background, RES);
  drawBackdrop(r, layers.grid);
  for (const onion of layers.onions) {
    blitSprite(r, stillSprite(layers.skin, onion.pose), ORIGIN_X, ORIGIN_Y, {
      tint: onion.tint,
      tintAmount: ONION.amount,
      alpha: ONION.alpha,
    });
  }
  if (layers.hero) {
    blitSprite(r, heroSprite(layers.skin, layers.hero.pose, layers.hero.ropes), ORIGIN_X, ORIGIN_Y);
  }
  return r;
}
