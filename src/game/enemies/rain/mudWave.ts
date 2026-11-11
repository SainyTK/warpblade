import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, hairline, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { RAIN_FOES as C, MUD_SPARKS } from "./colors";

const SPEED = 125;
const HEIGHT = 9;
/** how far the drawn crest reaches behind and ahead of its centre, in art pixels */
const BACK = 10;
const FRONT = 3;

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
      // a curling crest: a long back rising to a lip that leans forward over a dark hollow
      for (let i = -BACK; i <= FRONT; i += 0.5) {
        const u = (i + BACK) / (BACK + FRONT);
        const top = GROUND - h * Math.sin(u * Math.PI * 0.55) ** 1.5;
        const x = o.x + i * dir;
        const depth = GROUND - top;
        hairline(x, GROUND, x, top, (v) =>
          v * depth > depth - 1.5 ? C.mudLight : i > 0 || v < 0.35 ? C.mudDark : C.mud,
        );
        fleck(x, top, i > -3 ? C.wetSky : C.mudRim);
      }
      // the lip curls over: a hooked tip, spray thrown ahead of it and the storm's glint along the back
      const lipX = o.x + (FRONT + 1) * dir;
      line(lipX - dir, GROUND - h, lipX + dir, GROUND - h + 1.5, C.mudLight);
      fleck(lipX + dir * 1.5, GROUND - h + 2.5, C.mudRim);
      const spray = (o.t * 9) % 1;
      fleck(lipX + dir * (2 + spray * 4), GROUND - h - 1 + spray * spray * 6, C.mudRim);
      fleck(lipX + dir * (1 + spray * 6), GROUND - h * 0.6 + spray * 3, C.mudLight);
      hairline(o.x - 7 * dir, GROUND - h * 0.45, o.x - 3 * dir, GROUND - h * 0.8, C.wetSkyDim);
      px(o.x - 2 * dir, GROUND - h * 0.6, C.wart);
      fleck(o.x - 2 * dir + 0.25, GROUND - h * 0.6 + 0.25, C.wartHot);
      px(o.x - 6 * dir, GROUND - h * 0.3, C.wart, 0.7);
      // a dark wet foot where it scrapes along the floor
      hairline(o.x - BACK * dir, GROUND + 0.25, o.x + FRONT * dir, GROUND + 0.25, C.mudDeep);
      glow(o.x, GROUND - h * 0.5, 12, C.wart, 0.18);
    },
  };
}
