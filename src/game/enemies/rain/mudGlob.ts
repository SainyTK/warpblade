import { GROUND, W } from "../../../constants/stage";
import { circle, ellipseRing, glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { game, hero, particles, rng } from "../../state";
import { fieldPace } from "../../timeFields";
import { boxHit, dust, heroBox } from "../../world";
import { RAIN_FOES as C, MUD_SPARKS } from "./colors";

const GRAVITY = 520;
const PUDDLE_LIFE = 2.4;
const PUDDLE_HALF = 10;

/** a brief sludge puddle where a glob splats: touching it on foot hurts once and drags at Kael's feet */
export function createMudPuddle(x: number, damage: number): Effect {
  let t = 0;
  const bit = new Set<number>();
  return {
    update(dt) {
      t += dt;
      eachStanding(() => {
        const on = hero.ground && Math.abs(hero.x - x) < PUDDLE_HALF && hero.y > GROUND - 3;
        if (!on || t <= 0.15) return;
        hero.vx -= hero.vx * 8 * dt;
        if (!bit.has(heroSlot()) && hero.inv <= 0) {
          bit.add(heroSlot());
          hurtHero(damage, x);
        }
      });
      if (rng.chance(dt * 3))
        particles.spawn(PK.DUST, x + rng.range(-6, 6), GROUND - 1, 0, -rng.range(3, 8), 0.5, {
          col: C.mudLight,
          size: rng.range(1, 2),
        });
      return t < PUDDLE_LIFE;
    },
    drawBack() {
      place();
      const fade = clamp((PUDDLE_LIFE - t) / 0.5);
      const grow = clamp(t / 0.12);
      const hw = PUDDLE_HALF * grow;
      for (let dx = -hw; dx <= hw; dx++) {
        const edge = Math.abs(dx) > hw - 2;
        px(x + dx, GROUND, edge ? C.puddleLip : C.puddle, fade);
        if (!edge) px(x + dx, GROUND + 1, C.puddle, fade * 0.8);
      }
      if (Math.sin(t * 9 + x) > 0.6) px(x + Math.sin(t * 3) * 5, GROUND - 1, C.globLight, fade);
      glow(x, GROUND, 12, C.wart, 0.08 * fade);
    },
    draw() {},
  };
}

/** a lobbed glob of mud that lands at tx after flight seconds; it hurts on a direct hit, and may leave a puddle */
export function createMudGlob(
  x: number,
  y: number,
  tx: number,
  flight: number,
  damage: number,
  puddle: number | null,
): Effect {
  const o = {
    x,
    y,
    vx: (clamp(tx, 8, W - 8) - x) / flight,
    vy: (GROUND - y - 0.5 * GRAVITY * flight * flight) / flight,
  };
  return {
    update(step) {
      // a Stillfield slows the shot where it flies
      const dt = step * fieldPace(o.x, o.y);
      o.vy += GRAVITY * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.3))
        particles.spawn(PK.SPARK, o.x, o.y, -o.vx * 0.1, 0, rng.range(0.1, 0.25), { sparks: MUD_SPARKS });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 3, o.y - 3, o.x + 3, o.y + 3], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) return false;
      if (o.y >= GROUND - 1) {
        dust(o.x, GROUND, 4);
        for (let i = 0; i < 6; i++)
          particles.spawn(PK.SPARK, o.x, GROUND - 2, rng.range(-90, 90), -rng.range(60, 150), rng.range(0.2, 0.4), {
            sparks: MUD_SPARKS,
          });
        if (puddle !== null) game.fx.push(createMudPuddle(o.x, puddle));
        return false;
      }
      return o.x > -10 && o.x < W + 10;
    },
    draw() {
      place();
      line(o.x - o.vx * 0.02, o.y - o.vy * 0.02, o.x, o.y, C.mud);
      circle(o.x, o.y, 2.6, C.mudDark);
      circle(o.x - 0.4, o.y - 0.4, 1.8, C.glob);
      px(o.x - 1, o.y - 1, C.globLight);
      // where it will land, so Kael can step away
      ellipseRing(clamp(tx, 8, W - 8), GROUND, 5, 1.3, C.wart, 0.5);
      glow(o.x, o.y, 8, C.wart, 0.15);
    },
  };
}
