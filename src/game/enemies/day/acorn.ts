import { W } from "../../../constants/stage";
import { ellipseRing, glow, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { hero, particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";

const GRAVITY = 420;
const SPLASH = { reach: 10, height: 14 } as const;

/** an acorn the Oakheart lobs at (tx, ty): a shrinking ring marks where it will land; it bursts there, or on Kael if it meets him first */
export function createAcorn(x: number, y: number, tx: number, ty: number, flight: number, dmg: number): Effect {
  const o = { x, y, t: 0, spin: rng.range(0, TAU) };
  const vx = (tx - x) / flight;
  let vy = (ty - y - 0.5 * GRAVITY * flight * flight) / flight;
  const burst = (): void => {
    for (let i = 0; i < 9; i++) {
      const a = rng.range(Math.PI, TAU);
      particles.spawn(PK.SPARK, o.x, o.y - 1, Math.cos(a) * 70, Math.sin(a) * 70, rng.range(0.2, 0.4), {
        sparks: DAY_SPARKS.bark,
      });
    }
    for (let i = 0; i < 3; i++)
      particles.spawn(PK.SHARD, o.x, o.y - 2, rng.range(-50, 50), -rng.range(50, 110), rng.range(0.4, 0.7), {
        col: DC.acorn,
        size: 1.5,
      });
    sfx.block();
  };
  return {
    update(dt) {
      o.t += dt;
      o.x += vx * dt;
      vy += GRAVITY * dt;
      o.y += vy * dt;
      o.spin += dt * 12;
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 2, o.y - 2, o.x + 2, o.y + 2], heroBox())) return;
        struck = true;
        hurtHero(dmg, o.x);
      });
      if (struck) {
        burst();
        return false;
      }
      if (o.t >= flight || o.y >= ty) {
        o.y = ty;
        eachStanding(() => {
          if (Math.abs(hero.x - tx) < SPLASH.reach && hero.y <= ty + 1 && hero.y > ty - SPLASH.height)
            hurtHero(dmg, tx);
        });
        burst();
        return false;
      }
      return o.x > -10 && o.x < W + 10;
    },
    drawBack() {
      // the landing mark tightens as the acorn comes down
      place();
      const k = Math.min(1, o.t / flight);
      const r = SPLASH.reach * (1.4 - k * 0.6);
      ellipseRing(tx, ty, r, r * 0.3, k > 0.75 ? DC.pollen[3] : DC.pollen[1], 0.5 + k * 0.5);
    },
    draw() {
      place();
      const c = Math.cos(o.spin) > 0;
      for (let i = -1; i <= 2; i++) px(o.x + i, o.y - 1, DC.acornCap);
      px(o.x - 1, o.y, DC.acorn);
      px(o.x, o.y, c ? DC.acornLit : DC.acorn);
      px(o.x + 1, o.y, c ? DC.acorn : DC.acornLit);
      px(o.x + 2, o.y, DC.bark[2]);
      px(o.x - 1, o.y + 1, DC.acorn);
      px(o.x, o.y + 1, DC.acorn);
      px(o.x + 1, o.y + 1, DC.acorn);
      px(o.x + 2, o.y + 1, DC.bark[2]);
      px(o.x, o.y + 2, DC.acorn);
      px(o.x + 1, o.y + 2, DC.bark[2]);
      px(o.x + (c ? 1 : 0), o.y - 2, DC.bark[1]);
      glow(o.x, o.y, 6, DC.pollen[1], 0.25);
    },
  };
}
