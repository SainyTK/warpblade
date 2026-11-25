import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place, shade } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { mix } from "../../../../utils/color";
import { clamp, smooth } from "../../../../utils/math";
import { FOE, FOE_SPARKS } from "../colors";
import { WYRM } from "./moves";

const BODY = { back: 18, front: 4, rise: 0.12 } as const;

export function createInkWave(x: number, dir: number, damage: number): Effect {
  const o = { x, t: 0, travelled: 0, struck: false };
  const height = (): number =>
    WYRM.wave.height * smooth(0, BODY.rise, o.t) * (1 - smooth(0.8, 1, o.travelled / WYRM.wave.reach));
  return {
    update(dt) {
      o.t += dt;
      const step = WYRM.wave.speed * dt;
      o.x += dir * step;
      o.travelled += step;
      const h = height();
      if (!o.struck && h > 4)
        eachStanding(() => {
          if (o.struck || !boxHit([o.x - 4, GROUND - h, o.x + 4, GROUND], heroBox())) return;
          o.struck = true;
          hurtHero(damage, o.x - dir * 6);
        });
      if (fxRng.chance(0.6))
        particles.spawn(PK.SPARK, o.x, GROUND - h, dir * fxRng.range(10, 40), -fxRng.range(30, 80), 0.35, {
          sparks: FOE_SPARKS.ink,
          size: 1,
        });
      const out = o.x < stageLeft() - 10 || o.x > stageRight() + 10;
      return o.travelled < WYRM.wave.reach && !out;
    },
    draw() {
      place();
      const h = height();
      if (h <= 0.5) return;
      const crest = o.x;
      const back = crest - dir * BODY.back;
      shade(
        Math.min(back, crest + dir * BODY.front),
        GROUND - h - 3,
        Math.max(back, crest + dir * BODY.front),
        GROUND + 1,
        (px, py, out) => {
          const u = (px - crest) * dir;
          const rise = u > 0 ? Math.max(0, 1 - u / BODY.front) ** 0.6 : Math.max(0, 1 + u / BODY.back) ** 1.4;
          const curl = u > -3 && u < 1.5 ? Math.sin(o.t * 18 + px) * 0.8 : 0;
          const top = GROUND - h * rise - curl;
          if (py < top || py > GROUND + 0.5) return;
          const depth = clamp((py - top) / Math.max(1, h));
          out.c = py - top < 0.8 ? FOE.inkSheen : mix(FOE.ink[3], FOE.ink[0], depth);
          if (u > -2 && u < 0 && py - top < 2) out.c = FOE.inkGlint;
        },
      );
      for (let i = 0; i < 4; i++) {
        const lx = crest - dir * (3 + i * 3.5);
        const ly = GROUND - h * 0.5 + Math.sin(o.t * 6 + i) * 2;
        fleck(lx, ly, FOE.letter, 0.8);
        fleck(lx + 0.5, ly + 0.5, FOE.letterHot, 0.6);
      }
      hairline(crest - dir * BODY.back, GROUND + 0.5, crest, GROUND + 0.5, FOE.ink[1]);
      glow(crest - dir * 4, GROUND - h * 0.5, 12, FOE.letter, 0.18);
    },
  };
}
