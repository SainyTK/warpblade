import { GROUND, W } from "../../../constants/stage";
import { glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { RAIN_FOES as C, MUD_SPARKS } from "./colors";

const SPEED = 125;
const HEIGHT = 9;

/** a crest of mud that rolls along the floor from x in direction dir after a delay; jump it, or it hurts once */
export function createMudWave(x: number, dir: number, damage: number, delay = 0): Effect {
  const o = { x, t: -delay };
  const bit = new Set<number>();
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      o.x += dir * SPEED * dt;
      const h = HEIGHT * Math.min(1, o.t * 6);
      eachStanding(() => {
        if (bit.has(heroSlot()) || !boxHit([o.x - 4, GROUND - h, o.x + 4, GROUND], heroBox())) return;
        bit.add(heroSlot());
        hurtHero(damage, o.x - dir * 10);
      });
      if (rng.chance(0.5))
        particles.spawn(PK.SPARK, o.x + dir * 2, GROUND - h, dir * rng.range(10, 50), -rng.range(30, 90), 0.3, {
          sparks: MUD_SPARKS,
        });
      return o.x > -12 && o.x < W + 12;
    },
    draw() {
      if (o.t < 0) return;
      place();
      const h = HEIGHT * Math.min(1, o.t * 6);
      // a curling crest: the lit lip leans forward over a dark trough
      for (let i = -10; i <= 3; i++) {
        const u = (i + 10) / 13;
        const top = GROUND - h * Math.sin(u * Math.PI * 0.55) ** 1.5;
        const x = o.x + i * dir;
        line(x, GROUND, x, top, i > 0 ? C.mudDark : C.mud);
        px(x, top, i > -3 ? C.mudRim : C.mudLight);
      }
      px(o.x + 4 * dir, GROUND - h + 1, C.mudRim);
      px(o.x - 2 * dir, GROUND - h * 0.6, C.wart);
      glow(o.x, GROUND - h * 0.5, 12, C.wart, 0.18);
    },
  };
}
