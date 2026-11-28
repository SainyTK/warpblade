import { disc, fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { WASP } from "./colors";
import { DART } from "./moves";

const HALF = 2;
const TRAIL = 0.05;

function splat(x: number, y: number): void {
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, x, y, fxRng.range(-60, 60), -fxRng.range(20, 90), fxRng.range(0.2, 0.4), {
      sparks: WASP.sparks,
    });
}

export function createSporeDart(x: number, y: number, angle: number, damage: number): Effect {
  const o = { x, y, vx: Math.cos(angle) * DART.speed, vy: Math.sin(angle) * DART.speed, t: 0 };
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.vy += DART.gravity * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      if (fxRng.chance(0.3))
        particles.spawn(PK.MOTE, o.x, o.y, fxRng.range(-4, 4), fxRng.range(-4, 4), fxRng.range(0.2, 0.4), {
          col: WASP.bulb[2],
          size: 0.5,
        });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - HALF, o.y - HALF, o.x + HALF, o.y + HALF], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        splat(o.x, o.y);
        return false;
      }
      if (o.y >= surfaceBelow(o.x, o.y - 4) - 1) {
        splat(o.x, o.y - 1);
        return false;
      }
      return o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    draw() {
      place();
      const bx = -o.vx * TRAIL;
      const by = -o.vy * TRAIL;
      hairline(o.x + bx * 1.6, o.y + by * 1.6, o.x + bx * 0.6, o.y + by * 0.6, WASP.bulb[1], 0.6);
      hairline(o.x + bx * 0.6, o.y + by * 0.6, o.x, o.y, WASP.bulb[2]);
      disc(o.x, o.y, 1.4, WASP.bulb[2], 1);
      fleck(o.x - 0.3, o.y - 0.3, WASP.bulb[4]);
      glow(o.x, o.y, 8, WASP.bulb[3], 0.4);
    },
  };
}
