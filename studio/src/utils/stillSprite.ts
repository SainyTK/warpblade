import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import type { SpriteImage } from '@game/types/sprite';
import { heroSprite } from './heroSprite';
import { stillHero } from './motionFrames';
import { poseCache } from './poseCache';

const drawn = poseCache<SpriteImage>();

/** The hero in a pose with the scarf at rest, drawn once per pose so unchanged frames are never redrawn. */
export function stillSprite(skin: HeroSkin, pose: Pose): SpriteImage {
  const known = drawn.get(skin, pose);
  if (known) {
    return known;
  }
  const hero = stillHero(skin, pose);
  const sprite = heroSprite(skin, hero.pose, hero.ropes);
  drawn.set(skin, pose, sprite);
  return sprite;
}
