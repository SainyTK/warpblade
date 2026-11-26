import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, hero, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const LIFE = 1.7;
const ARMED = 0.12;
const COOLING = 0.6;
const FEET = 3;

export function createSlagPuddle(x: number, half: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      eachStanding(() => {
        const on = hero.ground && Math.abs(hero.x - x) < half && hero.y > GROUND - FEET;
        if (!on || t < ARMED || t > LIFE - COOLING * 0.5 || struck.has(heroSlot()) || hero.inv > 0) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      if (t < LIFE - COOLING && fxRng.chance(dt * 9))
        particles.spawn(
          PK.FIRE,
          x + fxRng.range(-half, half) * 0.8,
          GROUND - 1,
          fxRng.range(-4, 4),
          -fxRng.range(12, 26),
          fxRng.range(0.2, 0.4),
          {
            size: fxRng.range(1, 1.8),
          },
        );
      if (fxRng.chance(dt * 4))
        particles.spawn(PK.EMBER, x + fxRng.range(-half, half), GROUND - 1, 0, -fxRng.range(10, 30), 0.5, {
          sparks: FORGE_SPARKS.ember,
        });
      return t < LIFE;
    },
    drawBack() {
      place();
      const grow = clamp(t / ARMED);
      const cool = clamp((t - (LIFE - COOLING)) / COOLING);
      const w = half * grow;
      for (let dx = -w; dx <= w; dx++) {
        const edge = Math.abs(dx) > w - 2;
        const lit = cool < 0.5 ? (edge ? FORGE.molten[2] : FORGE.molten[3]) : edge ? FORGE.crust[2] : FORGE.molten[1];
        px(x + dx, GROUND - 0.5, cool > 0.85 ? FORGE.crust[1] : lit, 1 - cool * 0.5);
      }
      if (cool < 0.6) {
        hairline(x - w * 0.5, GROUND - 0.75, x + w * 0.3, GROUND - 0.75, FORGE.molten[4], 1 - cool);
        fleck(x + Math.sin(t * 7 + x) * w * 0.6, GROUND - 1, FORGE.molten[5], 1 - cool);
      }
      glow(x, GROUND - 1, half + 6, FORGE.molten[2], 0.28 * (1 - cool));
    },
    draw() {},
  };
}
