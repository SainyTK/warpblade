import { detailCanvas } from '@game/engine/sprite';
import { applySkin } from '@game/game/hero/skin';
import { drawHero } from '@game/rig';
import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import type { SpriteImage } from '@game/types/sprite';
import type { Point } from '@/types/studio';

/** The game's hero canvas size and feet position (scene/drawActors.ts). */
const canvas = detailCanvas(80, 76, 40, 62);

/** The hero drawn by the game's drawHero at the game's detail, facing right, with the weapon in hand, in their own look. */
export function heroSprite(
  skin: HeroSkin,
  pose: Pose,
  ropes: { scarf: Point[]; tail: Point[] },
): SpriteImage {
  applySkin(skin);
  drawHero(canvas, pose, skin, {
    scarf: ropes.scarf.map(([x, y]) => [x, y]),
    tail: ropes.tail.map(([x, y]) => [x, y]),
    flare: 0,
    sword: true,
  });
  return canvas.snapshot();
}
