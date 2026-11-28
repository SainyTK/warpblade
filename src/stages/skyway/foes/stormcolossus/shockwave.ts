import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, hero, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SKY_SPARKS } from "../colors";
import { COLOSSUS as K } from "./colors";
import { SLAM } from "./constants";

const WAVE = { half: 5, tall: 9, fade: 0.18 } as const;

export function createShockwave(x: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  const life = SLAM.reach / SLAM.speed;
  const fronts = (): number[] => {
    const d = Math.min(SLAM.reach, t * SLAM.speed);
    return [clamp(x - d, stageLeft(), stageRight()), clamp(x + d, stageLeft(), stageRight())];
  };
  return {
    update(dt) {
      t += dt;
      if (t <= life)
        for (const fx of fronts()) {
          if (fxRng.chance(0.5))
            particles.spawn(PK.DUST, fx, GROUND - 1, fxRng.range(-20, 20), -fxRng.range(10, 40), 0.4, {
              col: K.vapour[1],
            });
          eachStanding(() => {
            if (struck.has(heroSlot()) || hero.y < GROUND - WAVE.tall) return;
            if (Math.abs(hero.x - fx) > WAVE.half + 5) return;
            struck.add(heroSlot());
            hurtHero(damage, x);
          });
        }
      return t < life + WAVE.fade;
    },
    draw() {
      place();
      const fade = 1 - clamp((t - life) / WAVE.fade);
      const d = Math.min(SLAM.reach, t * SLAM.speed);
      for (const dir of [-1, 1]) {
        const fx = x + dir * d;
        if (fx < stageLeft() || fx > stageRight()) continue;
        const h = WAVE.tall * (1 - (d / SLAM.reach) * 0.4);
        for (let k = 0; k < 4; k++) {
          const bx = fx - dir * k * 3;
          const kh = h * (1 - k * 0.22);
          line(bx, GROUND, bx - dir * 1.5, GROUND - kh, k === 0 ? K.core[4] : K.vapour[2 - Math.min(2, k)], fade);
        }
        hairline(x, GROUND - 0.5, fx, GROUND - 0.5, K.core[3], fade * 0.5);
        fleck(fx - dir, GROUND - h - 1, SKY_SPARKS.volt[0], fade);
        glow(fx, GROUND - 4, 12, K.core[2], 0.45 * fade);
      }
    },
  };
}
