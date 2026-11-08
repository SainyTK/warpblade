import { PAL, SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { circle, glow, place, px } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { eachStanding } from "../coopHooks";
import { hurtHero } from "../hurtHero";
import { shotWarded } from "../shotWards";
import { game, particles, rng } from "../state";
import { boxHit, heroBox } from "../world";
import { createImpact } from "./impact";

/** a slow orb of shadow fired by the Rift Warden; it bursts on Kael, the floor or the edge of the stage */
export function createShadowOrb(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, t: 0 };
  const S = PAL.shadow;
  return {
    update(dt) {
      o.t += dt;
      o.x += vx * dt;
      o.y += vy * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.5))
        particles.spawn(PK.EMBER, o.x, o.y, -vx * 0.1, -vy * 0.1, rng.range(0.2, 0.4), { sparks: SPARKS.shadow });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 3, o.y - 3, o.x + 3, o.y + 3], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) return false;
      if (o.y >= GROUND - 2 || o.x < -6 || o.x > W + 6 || o.t > 4) {
        if (o.y >= GROUND - 2) game.fx.push(createImpact(o.x, GROUND - 3, 1, false, SPARKS.shadow));
        return false;
      }
      return true;
    },
    draw() {
      place();
      circle(o.x, o.y, 3.4, S[2]);
      circle(o.x - 0.5, o.y - 0.5, 2.2, S[4]);
      px(o.x - 1, o.y - 1, WHITE);
      glow(o.x, o.y, 16, S[3], 0.55);
    },
  };
}
