import { GROUND } from "../../../../constants/stage";
import { glow, hairline, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SENTINEL_COLORS as C, SENTINEL_SPARKS } from "./colors";
import { SENTINEL } from "./constants";

const W = SENTINEL.wave;
const SLABS = 3;

function slab(x: number, h: number, lean: number): void {
  polygon(
    [
      [x - 2.5, 0],
      [x - 2 + lean, -h],
      [x + 1 + lean, -h - 1],
      [x + 2.5, 0],
    ],
    C.stone[2],
  );
  hairline(x - 2 + lean, -h, x + 1 + lean, -h - 1, C.stone[4]);
  hairline(x + 1 + lean, -h - 1, x + 2.5, 0, C.stone[1]);
  hairline(x - 2.5, 0, x - 2 + lean, -h, C.outline);
}

export function createSlamWave(x0: number, dir: number, damage: number): Effect {
  let t = 0;
  let x = x0;
  const struck = new Set<number>();
  const rise = (): number => W.height * clamp(t / 0.08) * clamp((W.life - t) / 0.25);
  return {
    update(dt) {
      t += dt;
      x += dir * W.speed * dt;
      const h = rise();
      if (fxRng.chance(dt * 30))
        particles.spawn(
          PK.DUST,
          x + fxRng.range(-3, 3),
          GROUND - 1,
          -dir * fxRng.range(5, 20),
          -fxRng.range(4, 14),
          0.4,
          {
            col: fxRng.pick(SENTINEL_SPARKS.grit),
            size: fxRng.range(1, 2),
          },
        );
      eachStanding(() => {
        if (struck.has(heroSlot()) || h < 3) return;
        if (!boxHit([x - W.half, GROUND - h, x + W.half, GROUND], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, x - dir * 8);
      });
      const out = x < stageLeft() + 4 || x > stageRight() - 4;
      return t < W.life && !out;
    },
    drawBack() {
      place(x, GROUND);
      hairline(-dir * 18 * clamp(t / 0.3), 0.5, 0, 0.5, C.crackDeep);
      hairline(-dir * 10 * clamp(t / 0.3), 0.5, 0, 0.5, C.crack);
      place();
    },
    draw() {
      const h = rise();
      if (h < 1) return;
      place(x, GROUND);
      glow(0, -2, 12, C.crack, 0.35 * (h / W.height));
      for (let i = SLABS - 1; i >= 0; i--) slab(-dir * i * 4, h * (1 - i * 0.3), dir * (1 + i));
      hairline(-2, -1, 2, -1, C.crackHot);
      place();
    },
  };
}
