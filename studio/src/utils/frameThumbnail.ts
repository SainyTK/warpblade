import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import type { Raster } from '@/types/studio';
import { poseCache } from './poseCache';
import { rasterCanvas } from './raster';
import { stillSprite } from './stillSprite';
import { thumbnail } from './thumbnail';

const rasters = poseCache<Raster>();
const canvases = poseCache<HTMLCanvasElement>();

/** A frame's picture with the scarf at rest, drawn once per pose so an edit redraws only the frame it changed. */
export function frameThumbnail(skin: HeroSkin, pose: Pose): Raster {
  const known = rasters.get(skin, pose);
  if (known) {
    return known;
  }
  const raster = thumbnail(stillSprite(skin, pose));
  rasters.set(skin, pose, raster);
  return raster;
}

/** The same picture on a canvas, to draw into a preview. */
export function framePicture(skin: HeroSkin, pose: Pose): HTMLCanvasElement {
  const known = canvases.get(skin, pose);
  if (known) {
    return known;
  }
  const canvas = rasterCanvas(frameThumbnail(skin, pose));
  canvases.set(skin, pose, canvas);
  return canvas;
}

export const hasFramePicture = (skin: HeroSkin, pose: Pose): boolean => canvases.has(skin, pose);
