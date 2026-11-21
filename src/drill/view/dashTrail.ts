import { blit } from "../../engine/sprite";
import type { Fighter } from "../../types/drill";
import type { SpriteImage } from "../../types/sprite";
import { mix } from "../../utils/color";

interface Shadow {
  sprite: SpriteImage;
  x: number;
  y: number;
  flip: boolean;
  age: number;
}

const FIRST_SHADOW = 0.016;
const SPACING = 0.035;
const LIFETIME = 0.18;
const SKY_BLUE = 0x70c5ff;
const ROYAL_BLUE = 0x3260e1;

export function createDashTrail() {
  let timeUntilShadow = FIRST_SHADOW;
  let shadows: Shadow[] = [];

  return {
    step(active: boolean, dt: number): boolean {
      for (const shadow of shadows) {
        shadow.age += dt;
      }
      shadows = shadows.filter(({ age }) => age < LIFETIME);
      if (!active) {
        timeUntilShadow = FIRST_SHADOW;
        return false;
      }
      timeUntilShadow -= dt;
      if (timeUntilShadow > 0) {
        return false;
      }
      timeUntilShadow += SPACING;
      return true;
    },
    stamp({ x, y, face }: Fighter, sprite: SpriteImage): void {
      shadows.push({ sprite: { ...sprite, d: sprite.d.slice() }, x, y, flip: face < 0, age: 0 });
    },
    draw(): void {
      for (const { sprite, x, y, flip, age } of shadows) {
        const fade = age / LIFETIME;
        blit(sprite, x, y, flip, {
          alpha: 0.72 * (1 - fade) ** 1.15,
          tint: mix(SKY_BLUE, ROYAL_BLUE, fade),
          tintAmount: 0.95,
          soft: true,
        });
      }
    },
  };
}
