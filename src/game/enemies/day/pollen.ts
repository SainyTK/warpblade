import { GROUND, W } from "../../../constants/stage";
import { place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { particles, rng } from "../../state";
import { fieldPace } from "../../timeFields";
import { boxHit, heroBox } from "../../world";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";
import { drawPollen } from "./drawPollen";

const FALL = 34;
const FADE = 0.5;

/** a puff of glittering pollen shed by a Glimmer Moth: it sways down to the floor, hurts on touch, then thins away */
export function createPollen(x: number, y: number, vx: number, damage: number): Effect {
  const o = { x, y, t: 0, landed: -1, seed: rng.range(0, 9) };
  const P = DC.pollen;
  return {
    update(step) {
      // a Stillfield slows the shot where it flies
      const dt = step * fieldPace(o.x, o.y);
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
      const landed = Math.max(0, o.landed);
      drawPollen(o.x, o.y, o.t, o.landed >= 0 ? 1 - o.landed / FADE : Math.min(1, o.t * 4), landed);
    },
  };
}
