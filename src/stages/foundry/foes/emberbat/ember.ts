import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const GRAVITY = 300;
const HALF = 2.5;
const TRAIL = 0.04;

function landingX(x: number, y: number, vx: number, vy: number, floor: number): number {
  const a = GRAVITY / 2;
  const c = y - floor;
  const time = (-vy + Math.sqrt(Math.max(0, vy * vy - 4 * a * c))) / (2 * a);
  return x + vx * time;
}

export function createEmber(x: number, y: number, vx: number, damage: number): Effect {
  const o = { x, y, vx, vy: 10, t: 0 };
  const floor = surfaceBelow(x, y);
  const mark = landingX(x, y, vx, o.vy, floor);
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.vy += GRAVITY * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      if (fxRng.chance(0.5))
        particles.spawn(PK.EMBER, o.x, o.y, fxRng.range(-6, 6), -fxRng.range(4, 14), fxRng.range(0.2, 0.4), {
          sparks: FORGE_SPARKS.ember,
        });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - HALF, o.y - HALF, o.x + HALF, o.y + HALF], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) return false;
      const ground = surfaceBelow(o.x, o.y - 4);
      if (o.y >= ground - 1) {
        for (let i = 0; i < 10; i++)
          particles.spawn(
            PK.SPARK,
            o.x,
            ground - 1,
            fxRng.range(-80, 80),
            -fxRng.range(40, 130),
            fxRng.range(0.2, 0.4),
            {
              sparks: FORGE_SPARKS.molten,
            },
          );
        particles.spawn(PK.FIRE, o.x, ground - 2, 0, -18, 0.35, { size: 2.4 });
        return false;
      }
      return o.y < GROUND + 10 && o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    draw() {
      place();
      const warn = clamp(o.t / 0.3);
      ellipseRing(mark, floor, 4, 1.2, FORGE.molten[2], 0.35 + warn * 0.4);
      hairline(mark - 1.5, floor, mark + 1.5, floor, FORGE.molten[4], 0.6 + warn * 0.4);
      const bx = -o.vx * TRAIL;
      const by = -o.vy * TRAIL;
      hairline(o.x + bx, o.y + by, o.x, o.y, FORGE.molten[2]);
      fleck(o.x + bx * 1.5, o.y + by * 1.5, FORGE.molten[1]);
      px(o.x - 1, o.y - 1, FORGE.crust[1]);
      px(o.x, o.y - 1, FORGE.molten[3]);
      px(o.x - 1, o.y, FORGE.molten[2]);
      px(o.x, o.y, FORGE.molten[4]);
      fleck(o.x - 0.25, o.y - 0.75, FORGE.molten[5]);
      glow(o.x, o.y, 8, FORGE.molten[2], 0.3);
    },
  };
}
