import { PAL, SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { circle, fleck, glow, place, px } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { eachStanding } from "../coopHooks";
import { hurtHero } from "../hurtHero";
import { shotWarded } from "../shotWards";
import { game, particles, rng } from "../state";
import { fieldPace } from "../timeFields";
import { boxHit, heroBox } from "../world";
import { createImpact } from "./impact";

/** the orb's layers as radii in art pixels, dark shell to white core, and the ring its sparks circle on */
const ORB = { shell: 3.6, body: 2.9, fire: 2.1, core: 1.1, orbit: 4.6 };
/** the tail: how many shrinking discs, how far apart, and how much thinner each is */
const TAIL = { length: 3, gap: 2.4, thin: 0.8 };

/** a slow orb of shadow fired by the Rift Warden; it bursts on Kael, the floor or the edge of the stage */
export function createShadowOrb(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, t: 0 };
  const S = PAL.shadow;
  const speed = Math.hypot(vx, vy) || 1;
  const ux = vx / speed;
  const uy = vy / speed;
  return {
    update(step) {
      // a Stillfield slows the shot where it flies
      const dt = step * fieldPace(o.x, o.y);
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
      const beat = Math.sin(o.t * 16) * 0.3;
      // a tail of shrinking shadow behind it
      for (let i = TAIL.length; i >= 1; i--) {
        const back = i * TAIL.gap;
        const sway = Math.sin(o.t * 20 + i * 1.4) * 0.5 * i;
        circle(
          o.x - ux * back - uy * sway,
          o.y - uy * back + ux * sway,
          ORB.shell - i * TAIL.thin,
          S[i > 1 ? 1 : 2],
          1 - i * 0.22,
        );
      }
      circle(o.x, o.y, ORB.shell, S[1]);
      circle(o.x, o.y, ORB.body + beat, S[2]);
      circle(o.x + ux * 0.4, o.y + uy * 0.4, ORB.fire + beat, S[3]);
      circle(o.x + ux * 0.7, o.y + uy * 0.7, ORB.core, S[5]);
      px(o.x + ux * 0.7 - 0.5, o.y + uy * 0.7 - 0.5, WHITE);
      // two sparks circle it
      for (let i = 0; i < 2; i++) {
        const a = o.t * 9 + i * Math.PI;
        fleck(o.x + Math.cos(a) * ORB.orbit, o.y + Math.sin(a) * ORB.orbit * 0.6, S[5]);
        fleck(o.x + Math.cos(a - 0.5) * ORB.orbit, o.y + Math.sin(a - 0.5) * ORB.orbit * 0.6, S[4], 0.6);
      }
      glow(o.x, o.y, 16 + beat * 4, S[3], 0.55);
      glow(o.x, o.y, 6, S[5], 0.35);
    },
  };
}
