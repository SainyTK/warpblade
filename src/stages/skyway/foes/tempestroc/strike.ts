import { GROUND } from "../../../../constants/stage";
import { circle, ellipseRing, glow, glowLine, hairline, line, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";

export const STRIKE_HALF = 7;
const LIVE = 0.08;
const BOLT_LIFE = 0.32;
const TOP = -8;

export function createStrike(x: number, mark: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  const path: [number, number][] = [];
  let built = false;
  const build = () => {
    built = true;
    let bx = x + fxRng.range(-10, 10);
    for (let y = TOP; y < GROUND; y += 9) {
      path.push([bx, y]);
      bx = x + (bx - x) * 0.6 + fxRng.range(-5, 5);
    }
    path.push([x, GROUND]);
    for (let i = 0; i < 12; i++)
      particles.spawn(PK.SPARK, x, GROUND - 1, fxRng.range(-120, 120), -fxRng.range(60, 170), 0.35, {
        sparks: SKY_SPARKS.volt,
      });
    shake(0.12, 2);
    sfx.thunder();
  };
  return {
    update(dt) {
      t += dt;
      const age = t - mark;
      if (age >= 0 && !built) build();
      if (age >= 0 && age < LIVE)
        eachStanding(() => {
          if (struck.has(heroSlot())) return;
          if (!boxHit([x - STRIKE_HALF, TOP, x + STRIKE_HALF, GROUND], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      return age < BOLT_LIFE;
    },
    drawBack() {
      if (t >= mark) return;
      place();
      const u = clamp(t / mark);
      const late = mark - t < 0.22;
      const r = STRIKE_HALF + (1 - u) * 8;
      ellipseRing(x, GROUND, r, r * 0.25, late ? C.volt[4] : C.volt[3], 0.5 + u * 0.5);
      hairline(x - STRIKE_HALF * u, GROUND + 0.25, x + STRIKE_HALF * u, GROUND + 0.25, C.volt[4], 0.9);
      for (let y = GROUND - 4; y > 20; y -= 6) {
        if ((y + game.t * 40) % 12 < 6) px(x, y, C.volt[late ? 4 : 2], 0.2 + u * 0.4);
      }
      glow(x, GROUND - 2, 16, C.volt[2], 0.15 + u * 0.3);
    },
    draw() {
      const age = t - mark;
      if (age < 0) return;
      place();
      const f = 1 - age / BOLT_LIFE;
      const flick = age > 0.06 && age < 0.1 ? 0.3 : 1;
      for (let i = 1; i < path.length; i++) {
        const [ax, ay] = path[i - 1];
        const [bx, by] = path[i];
        line(ax - 1, ay, bx - 1, by, C.volt[2], 0.7 * f * flick);
        line(ax + 1, ay, bx + 1, by, C.volt[2], 0.7 * f * flick);
        line(ax, ay, bx, by, age < 0.07 ? WHITE : C.volt[4], f * flick);
        if (i % 3 === 0 && age < 0.12) {
          const side = i % 2 ? 1 : -1;
          hairline(ax, ay, ax + side * 7, ay + 5, C.volt[3], flick);
          hairline(ax + side * 7, ay + 5, ax + side * 9, ay + 11, C.volt[2], flick);
        }
      }
      if (age < 0.12) {
        circle(x, GROUND - 1, 3, WHITE);
        hairline(x - 12, GROUND - 0.5, x + 12, GROUND - 0.5, C.volt[4]);
      }
      glowLine(x, 0, x, GROUND, 12, C.volt[2], 0.5 * f);
      glow(x, GROUND - 2, 24, C.volt[3], 0.55 * f);
      ellipseRing(x, GROUND, STRIKE_HALF + age * 70, (STRIKE_HALF + age * 70) * 0.25, C.volt[3], f);
    },
  };
}
