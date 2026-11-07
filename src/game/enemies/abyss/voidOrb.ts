import { GROUND, W } from "../../../constants/stage";
import { circle, glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { game, particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";

export const ORB_GRAVITY = 240;

/** a glob of void spat by the Abyss Maw: it arcs down and bursts on Kael, the floor or the edge of the stage */
export function createVoidOrb(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, vy, t: 0 };
  const burst = () => {
    game.fx.push(createFloorRing(o.x, GROUND, 12, VOID, 0.3));
    for (let i = 0; i < 6; i++)
      particles.spawn(PK.SPARK, o.x, Math.min(o.y, GROUND - 1), rng.range(-70, 70), rng.range(-120, -20), 0.25, {
        sparks: VOID_SPARKS,
      });
  };
  return {
    update(dt) {
      o.t += dt;
      o.vy += ORB_GRAVITY * dt;
      o.x += vx * dt;
      o.y += o.vy * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.5))
        particles.spawn(PK.EMBER, o.x, o.y, -vx * 0.1, -o.vy * 0.1, rng.range(0.2, 0.4), { sparks: VOID_SPARKS });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 3, o.y - 3, o.x + 3, o.y + 3], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        burst();
        return false;
      }
      if (o.y >= GROUND - 2) {
        burst();
        return false;
      }
      return o.x > -6 && o.x < W + 6 && o.t < 4;
    },
    draw() {
      place();
      const wob = Math.sin(o.t * 30) * 0.3;
      circle(o.x, o.y, 3.4 + wob, VOID[1]);
      circle(o.x, o.y, 2.6, VOID[3]);
      circle(o.x - 0.6, o.y - 0.6, 1.4, VOID[4]);
      px(o.x - 1, o.y - 1, VOID[5]);
      glow(o.x, o.y, 14, VOID[3], 0.5);
    },
  };
}
