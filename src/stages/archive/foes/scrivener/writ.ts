import { GROUND } from "../../../../constants/stage";
import { glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FOE, FOE_SPARKS } from "../colors";
import { bigLetter } from "../letters";
import { WRIT } from "./moves";

const TRAIL = 5;

export function createWrit(x: number, dir: number, damage: number): Effect {
  const o = { x, travelled: 0, t: 0 };
  const struck = new Set<number>();
  return {
    update(step) {
      const dt = step * fieldPace(o.x, GROUND - 4);
      o.t += dt;
      o.x += dir * WRIT.speed * dt;
      o.travelled += WRIT.speed * dt;
      const lift = WRIT.height * clamp(o.t * 6);
      eachStanding(() => {
        if (struck.has(heroSlot())) return;
        if (!boxHit([o.x - WRIT.half, GROUND - lift, o.x + WRIT.half, GROUND], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, o.x - dir * 6);
      });
      if (fxRng.chance(dt * 30))
        particles.spawn(PK.MOTE, o.x + fxRng.range(-4, 4), GROUND - fxRng.range(1, 8), 0, -20, 0.4, {
          col: FOE.letter,
          size: 0.6,
        });
      const done = o.travelled >= WRIT.range || o.x < stageLeft() + 4 || o.x > stageRight() - 4;
      if (done)
        for (let i = 0; i < 8; i++)
          particles.spawn(PK.SPARK, o.x, GROUND - 4, fxRng.range(-50, 50), -fxRng.range(30, 90), 0.35, {
            sparks: FOE_SPARKS.letter,
          });
      return !done;
    },
    drawBack() {
      place();
      const fade = clamp(1 - o.travelled / WRIT.range + 0.3);
      for (let i = 0; i < TRAIL * 4; i++) {
        const tx = o.x - dir * i * 1.5;
        hairline(tx, GROUND, tx + dir, GROUND, FOE.ink[1 + (i % 2)], fade * (1 - i / (TRAIL * 4)));
      }
    },
    draw() {
      place();
      const fade = clamp(1 - o.travelled / WRIT.range + 0.3);
      const lift = WRIT.height * clamp(o.t * 6);
      glow(o.x, GROUND - lift * 0.5, 12, FOE.letter, 0.28 * fade);
      for (let i = 0; i < 3; i++) {
        const lx = o.x - dir * i * 4 - 1.5;
        const bob = Math.sin(o.t * 14 - i * 1.4) * 1.2;
        const ly = GROUND - lift + i * 2.5 + bob;
        bigLetter(lx, ly, i + Math.floor(o.t * 8), FOE.letter, FOE.letterHot, fade * (1 - i * 0.2));
      }
    },
  };
}
