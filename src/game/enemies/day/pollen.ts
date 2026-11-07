import { GROUND, W } from "../../../constants/stage";
import { glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";

const FALL = 34;
const FADE = 0.5;

/** a puff of glittering pollen shed by a Glimmer Moth: it sways down to the floor, hurts on touch, then thins away */
export function createPollen(x: number, y: number, vx: number, damage: number): Effect {
  const o = { x, y, t: 0, landed: -1, seed: rng.range(0, 9) };
  const P = DC.pollen;
  return {
    update(dt) {
      o.t += dt;
      if (o.landed >= 0) {
        o.landed += dt;
        return o.landed < FADE;
      }
      o.x += (vx * Math.max(0, 1 - o.t) + Math.sin(o.t * 3 + o.seed) * 10) * dt;
      o.y += FALL * Math.min(1, 0.4 + o.t) * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.15))
        particles.spawn(PK.MOTE, o.x + rng.range(-3, 3), o.y, rng.range(-6, 6), rng.range(4, 12), rng.range(0.3, 0.6), {
          col: rng.chance(0.5) ? P[2] : DC.pollenPink,
          size: 0.5,
        });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 4, o.y - 4, o.x + 4, o.y + 4], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        for (let i = 0; i < 8; i++) {
          const a = rng.range(0, TAU);
          particles.spawn(PK.SPARK, o.x, o.y, Math.cos(a) * 50, Math.sin(a) * 50, rng.range(0.2, 0.4), {
            sparks: DAY_SPARKS.pollen,
          });
        }
        return false;
      }
      if (o.y >= GROUND - 3 || o.x < -8 || o.x > W + 8 || o.t > 6) o.landed = 0;
      return true;
    },
    draw() {
      place();
      const k = o.landed >= 0 ? 1 - o.landed / FADE : Math.min(1, o.t * 4);
      const spread = 3.5 + (o.landed >= 0 ? o.landed * 10 : 0);
      for (let i = 0; i < 9; i++) {
        const a = o.t * (i % 2 ? 2.2 : -1.6) + i * 2.4;
        const r = spread * (0.35 + ((i * 37) % 10) / 14);
        const tw = Math.sin(o.t * 9 + i * 1.7);
        const c = tw > 0.6 ? P[3] : i % 3 === 0 ? DC.pollenPink : i % 2 ? P[2] : P[1];
        px(o.x + Math.cos(a) * r, o.y + Math.sin(a) * r * 0.8, c, k);
      }
      px(o.x, o.y, P[3], k);
      glow(o.x, o.y, 11, P[2], 0.35 * k);
    },
  };
}
