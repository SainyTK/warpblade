import type { Color } from '@game/types/color';
import type { Pose } from '@game/types/pose';
import { ONION, ORIGIN_X, ORIGIN_Y, STAGE_COLORS, STAGE_H, STAGE_W } from '@/constants/stage';
import type { Point, Raster } from '@/types/studio';
import { heroSprite } from './heroSprite';
import { blitPixels, blitSprite, put, raster } from './raster';
import { RopeRig } from './ropes';

export interface HeroLayer {
  pose: Pose;
  root: { x: number; y: number };
  ropes: { scarf: Point[]; tail: Point[] };
}

export interface StageLayers {
  hero: HeroLayer | null;
  /** Dim Kael behind a drawing. */
  heroAlpha: number;
  onions: { pose: Pose; root: { x: number; y: number }; tint: Color }[];
  pixels: Readonly<Record<string, number>> | null;
  pixelOnions: { pixels: Readonly<Record<string, number>>; tint: Color }[];
  grid: boolean;
  background: boolean;
}

/** A still Kael for a pose, with the scarf and ponytail settled. */
export function stillHero(pose: Pose, root = { x: 0, y: 0 }): HeroLayer {
  return { pose, root, ropes: RopeRig.settled(pose).look({ x: 0, y: 0 }) };
}

function drawBackdrop(r: Raster, grid: boolean): void {
  if (grid) {
    for (let y = 0; y < r.h; y++) {
      for (let x = 0; x < r.w; x++) {
        if ((x - ORIGIN_X) % 8 === 0 && (y - ORIGIN_Y) % 8 === 0) {
          put(r, x, y, STAGE_COLORS.grid);
        }
      }
    }
  }
  for (let x = 0; x < r.w; x++) {
    put(r, x, ORIGIN_Y, STAGE_COLORS.ground);
  }
  put(r, ORIGIN_X, ORIGIN_Y, STAGE_COLORS.origin);
}

/** The stage window: backdrop, onion skins, Kael and the drawn effect, in art pixels. */
export function stageRaster(layers: StageLayers): Raster {
  const r = raster(STAGE_W, STAGE_H, layers.background ? STAGE_COLORS.background : 0);
  if (layers.background) {
    drawBackdrop(r, layers.grid);
  }
  for (const onion of layers.onions) {
    const hero = stillHero(onion.pose, onion.root);
    const sprite = heroSprite(hero.pose, hero.ropes);
    blitSprite(r, sprite, ORIGIN_X + onion.root.x, ORIGIN_Y + onion.root.y, {
      tint: onion.tint,
      tintAmount: ONION.amount,
      alpha: ONION.alpha,
    });
  }
  if (layers.hero) {
    const { pose, root, ropes } = layers.hero;
    blitSprite(r, heroSprite(pose, ropes), ORIGIN_X + root.x, ORIGIN_Y + root.y, {
      alpha: layers.heroAlpha,
    });
  }
  for (const onion of layers.pixelOnions) {
    blitPixels(r, onion.pixels, ORIGIN_X, ORIGIN_Y, {
      tint: onion.tint,
      tintAmount: ONION.amount,
      alpha: ONION.alpha,
    });
  }
  if (layers.pixels) {
    blitPixels(r, layers.pixels, ORIGIN_X, ORIGIN_Y);
  }
  return r;
}
