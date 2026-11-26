import { ellipseRing, fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const DROP = { fall: 0.42, from: 8, half: 6, height: 12 } as const;

export function createMoltenDrop(x: number, mark: number, damage: number): Effect {
  let t = 0;
  const floor = surfaceBelow(x, DROP.from + 2);
  let landed = false;
  return {
    update(dt) {
      t += dt;
      if (t < mark) return true;
      const u = (t - mark) / DROP.fall;
      if (u < 1) {
        const y = DROP.from + (floor - DROP.from) * u * u;
        if (fxRng.chance(0.5))
          particles.spawn(PK.EMBER, x, y, fxRng.range(-6, 6), -10, 0.3, { sparks: FORGE_SPARKS.molten });
        return true;
      }
      if (!landed) {
        landed = true;
        eachStanding(() => {
          if (!boxHit([x - DROP.half, floor - DROP.height, x + DROP.half, floor], heroBox())) return;
          hurtHero(damage, x);
        });
        for (let i = 0; i < 10; i++)
          particles.spawn(PK.SPARK, x, floor - 2, fxRng.range(-90, 90), -fxRng.range(50, 140), fxRng.range(0.2, 0.45), {
            sparks: FORGE_SPARKS.molten,
          });
        particles.spawn(PK.FIRE, x, floor - 2, 0, -16, 0.4, { size: 2.6 });
      }
      return t < mark + DROP.fall + 0.25;
    },
    draw() {
      place();
      const warn = clamp(t / mark);
      if (t < mark + DROP.fall) {
        ellipseRing(x, floor, DROP.half, 1.6, FORGE.molten[2], 0.35 + warn * 0.5);
        hairline(x - 2, floor, x + 2, floor, warn > 0.7 ? FORGE.molten[5] : FORGE.molten[3], 0.5 + warn * 0.5);
        if (Math.sin(t * 20 + x) > 0) fleck(x, floor - 1 - warn * 3, FORGE.molten[4], warn);
        glow(x, floor, 8, FORGE.molten[2], 0.12 + warn * 0.25);
      }
      if (t < mark) {
        fleck(x, DROP.from + warn * 2, FORGE.molten[3], warn);
        return;
      }
      const u = (t - mark) / DROP.fall;
      if (u < 1) {
        const y = DROP.from + (floor - DROP.from) * u * u;
        hairline(x, y - 8 * u - 2, x, y - 1, FORGE.molten[2]);
        px(x - 0.5, y - 1, FORGE.molten[4]);
        fleck(x, y, FORGE.molten[5]);
        glow(x, y, 8, FORGE.molten[2], 0.3);
        return;
      }
      const after = clamp((t - mark - DROP.fall) / 0.25);
      hairline(x - DROP.half * after, floor - 0.5, x + DROP.half * after, floor - 0.5, FORGE.molten[3], 1 - after);
      glow(x, floor - 2, 12, FORGE.molten[3], 0.4 * (1 - after));
    },
  };
}
