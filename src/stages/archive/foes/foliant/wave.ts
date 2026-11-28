import { GROUND } from "../../../../constants/stage";
import { glow, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";
import { PAGE_WAVE } from "./moves";

const P = FOE.paper;

export function createPageWave(x: number, dir: number, damage: number): Effect {
  const o = { x, run: 0, t: 0 };
  const struck = new Set<number>();
  return {
    update(dt) {
      o.t += dt;
      o.x += dir * PAGE_WAVE.speed * dt;
      o.run += PAGE_WAVE.speed * dt;
      const h = PAGE_WAVE.height * (1 - o.run / PAGE_WAVE.range);
      eachStanding(() => {
        if (struck.has(heroSlot()) || h < 3) return;
        if (!boxHit([o.x - PAGE_WAVE.half, GROUND - h, o.x + PAGE_WAVE.half, GROUND], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, o.x - dir * 6);
      });
      if (fxRng.chance(dt * 40))
        particles.spawn(PK.FLAKE, o.x, GROUND - h, -dir * fxRng.range(10, 40), -fxRng.range(20, 60), 0.6, {
          col: P[fxRng.int(2, 4)],
          size: 1,
        });
      return o.run < PAGE_WAVE.range && o.x > stageLeft() && o.x < stageRight();
    },
    draw() {
      place();
      const k = clamp(1 - o.run / PAGE_WAVE.range);
      const h = PAGE_WAVE.height * k;
      for (let i = 0; i < 4; i++) {
        const bx = o.x - dir * i * 3;
        const bh = h * (1 - i * 0.22);
        const lean = dir * (2 + i);
        polygon(
          [
            [bx - 2.5, GROUND],
            [bx + lean - 1, GROUND - bh],
            [bx + lean + 1.5, GROUND - bh + 1],
            [bx + 2.5, GROUND],
          ],
          P[4 - (i % 3)],
          0.9 - i * 0.15,
        );
      }
      glow(o.x, GROUND - h * 0.5, 10, P[3], 0.2 * k);
    },
  };
}
