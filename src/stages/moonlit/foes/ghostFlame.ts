import { GROUND } from "../../../constants/stage";
import { circle, fleck, glow, hairline, place, px } from "../../../engine/frame";
import { stageLeft, stageRight } from "../../../game/adventure";
import { eachStanding } from "../../../game/coopHooks";
import { hurtHero } from "../../../game/hurtHero";
import { shotWarded } from "../../../game/shotWards";
import { fxRng, hero, particles } from "../../../game/state";
import { fieldPace } from "../../../game/timeFields";
import { boxHit, heroBox } from "../../../game/world";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { SHADE_COLORS as C, GHOST_SPARKS } from "./shadeColors";

const FLAME = { speed: 58, turn: 1.1, life: 3.4, fade: 0.4, hit: 4 } as const;

export function createGhostFlame(x: number, y: number, damage: number): Effect {
  const o = { x, y, angle: Math.atan2(hero.y - 16 - y, hero.x - x), t: 0 };
  let spent = false;
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      const want = Math.atan2(hero.y - 16 - o.y, hero.x - o.x);
      let turn = want - o.angle;
      while (turn > Math.PI) turn -= Math.PI * 2;
      while (turn < -Math.PI) turn += Math.PI * 2;
      o.angle += clamp(turn, -FLAME.turn * dt, FLAME.turn * dt);
      o.x += Math.cos(o.angle) * FLAME.speed * dt;
      o.y = Math.min(GROUND - 3, o.y + Math.sin(o.angle) * FLAME.speed * dt);
      if (shotWarded(o.x, o.y)) return false;
      if (fxRng.chance(0.35))
        particles.spawn(PK.EMBER, o.x + fxRng.range(-2, 2), o.y, fxRng.range(-6, 6), -fxRng.range(10, 24), 0.4, {
          sparks: GHOST_SPARKS,
        });
      eachStanding(() => {
        if (spent || !boxHit([o.x - FLAME.hit, o.y - FLAME.hit, o.x + FLAME.hit, o.y + FLAME.hit], heroBox())) return;
        spent = true;
        hurtHero(damage, o.x);
      });
      if (spent) {
        for (let i = 0; i < 8; i++)
          particles.spawn(PK.SPARK, o.x, o.y, fxRng.range(-70, 70), fxRng.range(-80, 30), 0.3, {
            sparks: GHOST_SPARKS,
          });
        return false;
      }
      return o.t < FLAME.life && o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    draw() {
      place();
      const fade = clamp((FLAME.life - o.t) / FLAME.fade);
      const flick = Math.sin(o.t * 23) * 0.6;
      const bx = -Math.cos(o.angle);
      const by = -Math.sin(o.angle);
      hairline(o.x + bx * 3, o.y + by * 3 - 1, o.x + bx * 8, o.y + by * 8 - 3 + flick, C.flame, fade);
      hairline(o.x + bx * 2, o.y + by * 2 + 1, o.x + bx * 6, o.y + by * 6 - 1 - flick, C.flameDeep, fade);
      circle(o.x, o.y, 3.2, C.flameDeep, fade);
      circle(o.x, o.y - 0.5, 2.5, C.flame, fade);
      circle(o.x - 0.3, o.y - 0.8, 1.5, C.flameLight, fade);
      px(o.x - 0.5, o.y - 3.5 + flick * 0.5, C.flame, fade);
      fleck(o.x - 0.5, o.y - 1, C.flameCore, fade);
      fleck(o.x + 0.5, o.y - 0.5, C.flameCore, fade);
      fleck(o.x - 1, o.y - 0.5, C.hollow, fade);
      fleck(o.x + 0.75, o.y - 1.25, C.hollow, fade);
      glow(o.x, o.y, 12, C.flame, 0.35 * fade);
    },
  };
}
