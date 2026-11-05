import { GROUND, W } from "../../../constants/stage";
import { glow, line, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { scale, WHITE } from "../../../utils/color";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { PRISM_SPARKS } from "./colors";

/** a sliver of prism crystal shot by a Prism Sprite; it shatters on Kael, the floor or the edge of the stage */
export function createPrismShard(x: number, y: number, vx: number, vy: number, damage: number, hue: Color): Effect {
  const o = { x, y, t: 0 };
  const sp = Math.hypot(vx, vy) || 1;
  const ux = vx / sp;
  const uy = vy / sp;
  const burst = (n: number) => {
    for (let i = 0; i < n; i++)
      particles.spawn(PK.SPARK, o.x, o.y, rng.range(-90, 90), rng.range(-110, 20), rng.range(0.1, 0.25), {
        sparks: PRISM_SPARKS,
      });
  };
  return {
    update(dt) {
      o.t += dt;
      o.x += vx * dt;
      o.y += vy * dt;
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
      line(o.x - ux * 7, o.y - uy * 7, o.x - ux * 3, o.y - uy * 3, scale(hue, 0.55), 0.6);
      line(o.x - ux * 3, o.y - uy * 3, o.x + ux * 2, o.y + uy * 2, hue);
      px(o.x - uy, o.y + ux, scale(hue, 0.75));
      px(o.x + uy, o.y - ux, scale(hue, 0.75));
      px(o.x + ux * 2, o.y + uy * 2, WHITE);
      px(o.x, o.y, WHITE);
      glow(o.x, o.y, 9, hue, 0.45);
    },
  };
}
