import { GROUND } from "../../../constants/stage";
import { drillProfile } from "../../../drill";
import { place } from "../../../engine/frame";
import { enemyBox } from "../../../game/enemies/enemy";
import { addStacks, type StackSpec } from "../../../game/enemies/skillStatus";
import { fxRng, game, particles } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { clamp, TAU } from "../../../utils/math";
import { BLIGHT } from "../colors";
import { type CloudTones, drawSporeCloud } from "../spores";

export const SPORE_SOURCE = "sporeburst";

export const ART_TONES: CloudTones = {
  deep: BLIGHT.fungus[1],
  body: BLIGHT.spore[1],
  lit: BLIGHT.spore[3],
  hot: BLIGHT.spore[4],
  grain: BLIGHT.fungus[3],
};

const EVERY = 0.5;
const GROW = 0.3;
const FADE = 0.7;
const LIFT = 11;

export function poisonSpec(level: number): StackSpec {
  const attack = drillProfile()?.attack ?? 10;
  return { stacks: 1, max: 3 + level, damage: attack * (0.16 + level * 0.06), every: EVERY, duration: 2.4 };
}

const touches = (e: Enemy, x: number, y: number, r: number): boolean => {
  const [x0, y0, x1, y1] = enemyBox(e);
  const nx = Math.max(x0, Math.min(x, x1));
  const ny = Math.max(y0, Math.min(y, y1));
  return (nx - x) ** 2 + (ny - y) ** 2 < r * r;
};

export function createSporeburstCloud(x: number, y: number, radius: number, life: number, level: number): Effect {
  const cy = y > GROUND - 4 ? y - LIFT : y;
  const seed = fxRng.range(0, TAU);
  let t = 0;
  let next = 0;
  const strength = (): number => clamp(t / GROW) * clamp((life - t) / FADE);
  return {
    update(dt) {
      t += dt;
      next -= dt;
      if (next <= 0 && strength() > 0.4) {
        next = EVERY;
        const spec = poisonSpec(level);
        for (const e of game.enemies) if (e.hp > 0 && touches(e, x, cy, radius)) addStacks(e, SPORE_SOURCE, spec);
      }
      if (fxRng.chance(0.3))
        particles.spawn(
          PK.MOTE,
          x + fxRng.range(-radius, radius),
          cy + fxRng.range(-radius, radius) * 0.6,
          fxRng.range(-4, 4),
          -fxRng.range(4, 14),
          fxRng.range(0.4, 0.9),
          { col: fxRng.pick([BLIGHT.spore[3], BLIGHT.fungus[3], BLIGHT.spore[4]]), size: 0.5 },
        );
      return t < life;
    },
    draw() {
      place();
      drawSporeCloud(x, cy, radius, t, strength(), seed, ART_TONES);
    },
  };
}
