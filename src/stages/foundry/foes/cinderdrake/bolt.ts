import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { FORGE, FORGE_SPARKS } from "../../colors";

const BOLT = { gravity: 60, half: 3, trail: 0.05 } as const;
const M = FORGE.molten;

function burst(x: number, y: number): void {
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, x, y, fxRng.range(-90, 90), -fxRng.range(30, 130), fxRng.range(0.2, 0.45), {
      sparks: FORGE_SPARKS.molten,
    });
  particles.spawn(PK.FIRE, x, y - 2, 0, -20, 0.4, { size: 3 });
}

export function createCinderBolt(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, vx, vy };
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.vy += BOLT.gravity * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      if (fxRng.chance(0.6))
        particles.spawn(PK.EMBER, o.x, o.y, fxRng.range(-8, 8), -fxRng.range(4, 14), fxRng.range(0.2, 0.4), {
          sparks: FORGE_SPARKS.ember,
        });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - BOLT.half, o.y - BOLT.half, o.x + BOLT.half, o.y + BOLT.half], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        burst(o.x, o.y);
        return false;
      }
      const ground = surfaceBelow(o.x, o.y - 4);
      if (o.y >= ground - 1) {
        burst(o.x, ground - 1);
        return false;
      }
      return o.y < GROUND + 10 && o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    draw() {
      place();
      const bx = -o.vx * BOLT.trail;
      const by = -o.vy * BOLT.trail;
      hairline(o.x + bx * 2, o.y + by * 2, o.x, o.y, M[1]);
      hairline(o.x + bx, o.y + by, o.x, o.y, M[3]);
      for (const [dx, dy, c] of [
        [-1, -1, M[3]],
        [0, -1, M[4]],
        [-1, 0, M[4]],
        [0, 0, M[5]],
        [1, 0, M[3]],
        [0, 1, M[2]],
      ] as const)
        px(o.x + dx, o.y + dy, c);
      fleck(o.x - 0.25, o.y - 0.25, M[5]);
      glow(o.x, o.y, 10, M[2], 0.4);
    },
  };
}
