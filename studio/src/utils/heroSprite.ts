import { drawHero } from '@game/game/hero/drawHero';
import { heroCanvas } from '@game/game/hero/heroCanvas';
import type { Pose } from '@game/types/pose';
import type { SpriteImage } from '@game/types/sprite';
import type { Point } from '@/types/studio';

/** The game's hero canvas size and feet position (scene/drawActors.ts). */
const canvas = heroCanvas(80, 76, 40, 62);
/** which of an art pixel's image pixels stand for it, first filled one wins: the lower right keeps outlines thin */
const SAMPLES: readonly [number, number][] = [
  [1, 1],
  [0, 0],
  [1, 0],
  [0, 1],
];

/** The detailed sprite brought down to one pixel per art pixel, the grid the studio poses and draws on. */
function toArtPixels(s: SpriteImage): SpriteImage {
  const k = s.res;
  const w = Math.floor(s.w / k);
  const h = Math.floor(s.h / k);
  const d = new Uint32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (const [u, v] of SAMPLES) {
        const c = s.d[(y * k + Math.min(v, k - 1)) * s.w + x * k + Math.min(u, k - 1)];
        if (c) {
          d[y * w + x] = c;
          break;
        }
      }
    }
  }
  return { w, h, ox: s.ox / k, oy: s.oy / k, res: 1, d };
}

/** Kael drawn by the game's drawHero, facing right, with the sword in hand. */
export function heroSprite(
  pose: Pose,
  ropes: { scarf: Point[]; tail: Point[] },
  flare = 0,
): SpriteImage {
  drawHero(canvas, pose, {
    scarf: ropes.scarf.map(([x, y]) => [x, y]),
    tail: ropes.tail.map(([x, y]) => [x, y]),
    flare,
    sword: true,
  });
  return toArtPixels(canvas.snapshot());
}
