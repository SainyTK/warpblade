import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, place, px } from "../../../../engine/frame";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FOE, FOE_SPARKS } from "../colors";
import { DRIP } from "./moves";

const F = FOE.flame;

export function createDripMark(x: number, life: number): Effect {
  let age = 0;
  return {
    update(dt) {
      age += dt;
      return age < life;
    },
    drawBack() {
      place();
      const k = clamp(age / life);
      const r = DRIP.splash * (0.6 + 0.4 * k);
      const blink = k > 0.75 && Math.floor(age * 20) % 2 === 0 ? 0.45 : 1;
      ellipseRing(x, GROUND, r, r * 0.25, F[2], (0.3 + 0.5 * k) * blink);
      glow(x, GROUND - 1, r + 2, F[2], 0.08 + 0.18 * k);
    },
    draw() {},
  };
}

export function createDrip(x: number, y: number, damage: number): Effect {
  const o = { y, vy: 0, landed: false, t: 0 };
  return {
    update(dt) {
      o.t += dt;
      if (o.landed) return o.t < DRIP.life;
      o.vy += DRIP.gravity * dt;
      o.y += o.vy * dt;
      if (fxRng.chance(dt * 30)) particles.spawn(PK.EMBER, x, o.y - 2, 0, -10, 0.25, { sparks: FOE_SPARKS.flame });
      if (o.y < GROUND - 1) return true;
      o.landed = true;
      o.t = 0;
      const r = DRIP.splash;
      eachStanding(() => {
        if (boxHit([x - r, GROUND - 12, x + r, GROUND], heroBox())) hurtHero(damage, x);
      });
      for (let i = 0; i < 10; i++)
        particles.spawn(PK.SPARK, x, GROUND - 2, fxRng.range(-80, 80), -fxRng.range(40, 120), fxRng.range(0.25, 0.45), {
          sparks: FOE_SPARKS.flame,
        });
      sfx.hit(false, 1.3);
      return true;
    },
    drawBack() {
      if (!o.landed) return;
      place();
      const fade = 1 - clamp(o.t / DRIP.life);
      for (let i = -3; i <= 3; i++) px(x + i, GROUND, i % 2 ? FOE.wax[2] : FOE.wax[3], fade);
      glow(x, GROUND - 2, 8, F[2], 0.25 * fade);
      if (Math.floor(o.t * 10) % 3 === 0) px(x + Math.round(Math.sin(o.t * 9) * 2), GROUND - 1, F[3], fade);
    },
    draw() {
      if (o.landed) return;
      place();
      glow(x, o.y, 7, F[2], 0.4);
      px(x - 0.5, o.y - 1.5, F[3]);
      px(x - 0.5, o.y - 0.5, F[4]);
      px(x - 0.5, o.y + 0.5, FOE.wax[3]);
      px(x - 0.5, o.y - 2.5, F[2], 0.6);
    },
  };
}
