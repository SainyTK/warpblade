import { disc, ellipseRing, fleck, glow, hairline, place, px } from "../../../engine/frame";
import { stageLeft, stageRight } from "../../../game/adventure";
import { eachStanding } from "../../../game/coopHooks";
import { hurtHero } from "../../../game/hurtHero";
import { shotWarded } from "../../../game/shotWards";
import { fxRng, game, hero, particles } from "../../../game/state";
import { fieldPace } from "../../../game/timeFields";
import { boxHit, heroBox } from "../../../game/world";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { BLIGHT, BLIGHT_SPARKS } from "../colors";
import { createPoisonPuddle } from "./poisonPuddle";

const GRAVITY = 380;
const SPLASH_HEIGHT = 14;

export interface SporeShot {
  x: number;
  y: number;
  tx: number;
  ty: number;
  flight: number;
  damage: number;
  size: number;
  splash: number;
  puddle: { half: number; life: number; damage: number };
}

function drawLandingMark(x: number, y: number, reach: number, k: number, t: number): void {
  const r = reach * (1.4 - 0.4 * k);
  const c = k > 0.75 ? BLIGHT.markHot : BLIGHT.mark;
  ellipseRing(x, y, r, r * 0.28, c, 0.35 + 0.55 * k, 1);
  ellipseRing(x, y, r, r * 0.28, c, 0.25 + 0.3 * k, -1);
  if (k > 0.5 && Math.sin(t * 30) > 0) fleck(x, y - 0.5, BLIGHT.markHot);
  glow(x, y, r + 3, BLIGHT.mark, 0.12 + 0.25 * k);
}

function drawShot(x: number, y: number, vx: number, vy: number, size: number, t: number): void {
  const speed = Math.hypot(vx, vy) || 1;
  const ux = vx / speed;
  const uy = vy / speed;
  for (let i = 1; i <= 3; i++) {
    const back = i * size * 0.75;
    disc(x - ux * back, y - uy * back, size * (1 - i * 0.22), BLIGHT.poison[2], 0.5 - i * 0.12);
  }
  disc(x, y, size + 0.5, BLIGHT.poison[1], 1);
  disc(x, y, size, BLIGHT.poison[2], 1);
  disc(x - size * 0.3, y - size * 0.3, size * 0.55, BLIGHT.poison[3], 1);
  px(x - size * 0.5, y - size * 0.6, BLIGHT.poison[4]);
  const a = t * 9;
  fleck(x + Math.cos(a) * size, y + Math.sin(a) * size, BLIGHT.spore[3]);
  hairline(x + ux * size, y + uy * size, x + ux * (size + 1), y + uy * (size + 1), BLIGHT.poison[1]);
  glow(x, y, 8 + size * 2, BLIGHT.poison[3], 0.45);
}

export function createSporeShot(shot: SporeShot): Effect {
  const { tx, ty, flight, damage, size, splash, puddle } = shot;
  const o = { x: shot.x, y: shot.y, t: 0 };
  const vx = (tx - shot.x) / flight;
  let vy = (ty - shot.y - 0.5 * GRAVITY * flight * flight) / flight;
  const splat = (): void => {
    for (let i = 0; i < 10 + size * 2; i++) {
      const a = fxRng.range(Math.PI, TAU);
      particles.spawn(PK.SPARK, o.x, o.y - 1, Math.cos(a) * 70, Math.sin(a) * 60, fxRng.range(0.2, 0.4), {
        sparks: BLIGHT_SPARKS.spore,
      });
    }
    sfx.block();
  };
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.x += vx * dt;
      vy += GRAVITY * dt;
      o.y += vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - size, o.y - size, o.x + size, o.y + size], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        splat();
        return false;
      }
      if (o.t >= flight || o.y >= ty) {
        o.y = ty;
        eachStanding(() => {
          if (Math.abs(hero.x - tx) < splash && hero.y <= ty + 1 && hero.y > ty - SPLASH_HEIGHT) hurtHero(damage, tx);
        });
        game.fx.push(createPoisonPuddle(tx, ty, puddle.half, puddle.life, puddle.damage));
        splat();
        return false;
      }
      return o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    drawBack() {
      place();
      drawLandingMark(tx, ty, splash, Math.min(1, o.t / flight), o.t);
    },
    draw() {
      place();
      drawShot(o.x, o.y, vx, vy, size, o.t);
    },
  };
}
