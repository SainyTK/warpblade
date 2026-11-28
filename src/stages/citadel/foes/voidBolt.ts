import { circle, fleck, glow, hairline, place } from "../../../engine/frame";
import { stageLeft, stageRight } from "../../../game/adventure";
import { VOID, VOID_SPARKS } from "../../../game/enemies/abyss/colors";
import { shotWarded } from "../../../game/shotWards";
import { fxRng, particles } from "../../../game/state";
import { fieldPace } from "../../../game/timeFields";
import { surfaceBelow } from "../../../game/world";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { strikeOnce } from "./strike";

const BOLT = { life: 2.6, half: 2.5, tail: 9 } as const;

function burst(x: number, y: number): void {
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SPARK, x, y, fxRng.range(-70, 70), fxRng.range(-90, 20), 0.25, { sparks: VOID_SPARKS });
}

export function createVoidBolt(x: number, y: number, angle: number, speed: number, damage: number): Effect {
  const o = { x, y, t: 0 };
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const struck = new Set<number>();
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.x += vx * dt;
      o.y += vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      strikeOnce(struck, [o.x - BOLT.half, o.y - BOLT.half, o.x + BOLT.half, o.y + BOLT.half], damage, o.x - vx * 0.05);
      if (struck.size > 0 || (vy > 0 && o.y >= surfaceBelow(o.x, o.y - 4))) {
        burst(o.x, o.y);
        return false;
      }
      if (fxRng.chance(0.4))
        particles.spawn(PK.EMBER, o.x, o.y, -vx * 0.1, -vy * 0.1, fxRng.range(0.15, 0.3), { sparks: VOID_SPARKS });
      return o.x > stageLeft() - 6 && o.x < stageRight() + 6 && o.t < BOLT.life;
    },
    draw() {
      place();
      const len = Math.hypot(vx, vy) || 1;
      const bx = -vx / len;
      const by = -vy / len;
      hairline(o.x + bx * 3, o.y + by * 3, o.x + bx * BOLT.tail, o.y + by * BOLT.tail, VOID[3], 0.8);
      circle(o.x + bx * 2.2, o.y + by * 2.2, 1.6, VOID[2], 0.8);
      circle(o.x, o.y, 2.4, VOID[2]);
      circle(o.x, o.y, 1.6, VOID[4]);
      fleck(o.x - 0.5, o.y - 0.5, VOID[5]);
      glow(o.x, o.y, 11, VOID[3], 0.5);
    },
  };
}
