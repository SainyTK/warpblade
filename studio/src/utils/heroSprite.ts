import { SpriteCanvas } from '@game/engine/sprite';
import { drawHero } from '@game/game/hero/drawHero';
import type { Pose } from '@game/types/pose';
import type { SpriteImage } from '@game/types/sprite';
import type { Point } from '@/types/studio';

/** The game's hero canvas size and feet position (scene/drawActors.ts). */
const heroCanvas = new SpriteCanvas(80, 76, 40, 62);

/** Kael drawn by the game's drawHero, facing right, with the sword in hand. */
export function heroSprite(
  pose: Pose,
  ropes: { scarf: Point[]; tail: Point[] },
  flare = 0,
): SpriteImage {
  drawHero(heroCanvas, pose, {
    scarf: ropes.scarf.map(([x, y]) => [x, y]),
    tail: ropes.tail.map(([x, y]) => [x, y]),
    flare,
    sword: true,
  });
  return heroCanvas.snapshot();
}
