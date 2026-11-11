import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, hairline, place, polygon } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { mix, scale, WHITE } from "../../../utils/color";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { game, particles, rng } from "../../state";
import { fieldPace } from "../../timeFields";
import { boxHit, heroBox } from "../../world";
import { PRISM_SPARKS } from "./colors";
import { createPrismFlash } from "./prismFlash";

/** the sliver's shape along its flight, in art pixels: its point, its widest part and the end of its tail */
const SLIVER = { tip: 4, waist: -0.5, half: 1.5, tail: -4.5, streak: 13 };
const SHATTER = 7;

/** a sliver of prism crystal shot by a Prism Sprite; it shatters on Kael, the floor or the edge of the stage */
export function createPrismShard(x: number, y: number, vx: number, vy: number, damage: number, hue: Color): Effect {
  const o = { x, y, t: 0 };
  const sp = Math.hypot(vx, vy) || 1;
  const ux = vx / sp;
  const uy = vy / sp;
  const lit = mix(hue, WHITE, 0.45);
  const shade = scale(hue, 0.7);
  const burst = (n: number) => {
    game.fx.push(createPrismFlash(o.x, o.y, hue, SHATTER));
    for (let i = 0; i < n; i++)
      particles.spawn(PK.SPARK, o.x, o.y, rng.range(-90, 90), rng.range(-110, 20), rng.range(0.1, 0.25), {
        sparks: PRISM_SPARKS,
      });
  };
  return {
    update(step) {
      // a Stillfield slows the shot where it flies
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.x += vx * dt;
      o.y += vy * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.35))
        particles.spawn(PK.MOTE, o.x, o.y, -vx * 0.1, -vy * 0.1, rng.range(0.15, 0.3), { col: hue, size: 0.5 });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 2, o.y - 2, o.x + 2, o.y + 2], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        burst(5);
        return false;
      }
      if (o.y >= GROUND - 1 || o.y < -8 || o.x < -6 || o.x > W + 6 || o.t > 3) {
        if (o.y >= GROUND - 1) burst(4);
        return false;
      }
      return true;
    },
    draw() {
      place();
      const at = (along: number, side: number): readonly [number, number] => [
        o.x + ux * along - uy * side,
        o.y + uy * along + ux * side,
      ];
      const [tx, ty] = at(SLIVER.tip, 0);
      const [bx, by] = at(SLIVER.tail, 0);
      // the streak it leaves, thinning to nothing, with a fainter edge either side
      hairline(...at(-SLIVER.streak, 0), bx, by, shade, (u) => u * 0.8);
      hairline(...at(-SLIVER.streak * 0.6, 0.5), ...at(SLIVER.waist, 1), shade, (u) => u * 0.6);
      hairline(...at(-SLIVER.streak * 0.6, -0.5), ...at(SLIVER.waist, -1), shade, (u) => u * 0.6);
      // the sliver: one face catching the light, the other in its own color, a white spine and point
      polygon([[tx, ty], at(SLIVER.waist, SLIVER.half), [bx, by], at(SLIVER.waist, -SLIVER.half)], (sx, sy = 0) =>
        (sx - o.x) * -uy + (sy - o.y) * ux < 0 === ux > 0 ? lit : hue,
      );
      hairline(...at(SLIVER.waist - 1, 0), tx, ty, WHITE);
      fleck(tx, ty, WHITE);
      if (Math.sin(o.t * 40) > 0.3) fleck(...at(SLIVER.waist, SLIVER.half + 0.5), WHITE);
      glow(o.x, o.y, 9, hue, 0.45);
      glow(tx, ty, 3.5, WHITE, 0.35);
    },
  };
}
